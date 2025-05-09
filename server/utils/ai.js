const { Professional, Appointment } = require('../models');
const { createCalendarEvent } = require('./googleOAuth');
const { sendSms } = require('./twilio');

// Process messages from the AI assistant
const processAiMessage = async (message, phoneNumber) => {
  try {
    // This is a simplified version - you would likely use a more sophisticated NLP 
    // approach or integrate with a service like OpenAI
    
    const messageLower = message.toLowerCase();
    
    // Check if this is an appointment booking request
    if (messageLower.includes('book') || messageLower.includes('appointment') || messageLower.includes('schedule')) {
      // Extract information from the message
      // This is a very basic approach - in reality you would want to use NLP
      
      // For demo purposes, let's assume a format like:
      // "Book appointment with [service] on [date] at [time]"
      
      // Extract service (very basic approach)
      let service = null;
      let date = null;
      let time = null;
      
      // Find a professional that offers this service
      const professionals = await Professional.find({});
      
      if (!professionals.length) {
        return "I'm sorry, we don't have any professionals available at the moment.";
      }
      
      // For demo, just use the first professional
      const professional = professionals[0];
      
      // Check if service exists
      const serviceFound = professional.services.find(s => 
        messageLower.includes(s.name.toLowerCase())
      );
      
      if (!serviceFound) {
        return `I couldn't find that service. ${professional.name} offers: ${professional.services.map(s => s.name).join(', ')}. Would you like to book one of these?`;
      }
      
      // Extract date and time (this is very basic - would need NLP in real app)
      // For demo, just create an appointment for tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(10, 0, 0, 0); // 10 AM
      
      const endTime = new Date(tomorrow);
      endTime.setMinutes(endTime.getMinutes() + serviceFound.duration);
      
      // Create the appointment
      const appointment = await Appointment.create({
        title: `${serviceFound.name} Appointment`,
        description: `Appointment for ${serviceFound.name}`,
        startTime: tomorrow,
        endTime: endTime,
        professionalId: professional._id,
        customerPhone: phoneNumber,
        status: 'confirmed'
      });
      
      // Add to Google Calendar if connected
      if (professional.googleRefreshToken) {
        await createCalendarEvent(professional._id, {
          title: appointment.title,
          description: appointment.description,
          startTime: appointment.startTime.toISOString(),
          endTime: appointment.endTime.toISOString(),
          customerEmail: 'customer@example.com' // In reality, get from database
        });
      }
      
      // Confirmation message
      return `Great! I've booked your ${serviceFound.name} appointment for ${tomorrow.toLocaleDateString()} at ${tomorrow.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}. See you then!`;
    }
    
    // Handle help requests
    if (messageLower.includes('help') || messageLower === 'menu') {
      return "I'm Eric, your AI booking assistant. I can help you:\n\n" +
        "- Book an appointment (just tell me what service and when)\n" +
        "- List available services\n" +
        "- Check business hours\n" +
        "- Reschedule or cancel an existing appointment\n\n" +
        "How can I help you today?";
    }
    
    // Handle service inquiries
    if (messageLower.includes('service') || messageLower.includes('offer')) {
      const professional = await Professional.findOne({});
      if (!professional) {
        return "I'm sorry, we don't have any service information available.";
      }
      
      const services = professional.services.map(s => 
        `${s.name} (${s.duration} min) - $${s.price}`
      ).join('\n');
      
      return `Here are our services:\n\n${services}\n\nWould you like to book an appointment?`;
    }
    
    // Default response
    return "Hello! I'm Eric, your AI booking assistant. How can I help you today? You can ask me to book an appointment, list our services, or check our hours.";
  } catch (error) {
    console.error('Error processing AI message:', error);
    return "I'm sorry, I encountered an error processing your request. Please try again.";
  }
};

module.exports = { processAiMessage };