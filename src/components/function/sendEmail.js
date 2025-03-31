
// ส่งอีเมล์
export const sendEmail = async (to_email,to_name,subject,sender_name,message) => {
    (function(){
        emailjs.init('WpZ8w49r4HNVwCqlh');
    })();
    const params = {
        to_email,
        to_name,
        subject,
        sender_name,
        message
    }
    // emailjs
    const serviceID = `service_6ssbld3`;
    const templateID = `template_bi2w9gg`;
    const sendMail = emailjs.send(serviceID,templateID,params);
    const issend = await sendMail;
    if(issend.status !== 200)return false;
    return true;
}

// รหัส OTP
export const randomOTP = () => {return `${Math.floor(Math.random() * 999999)}`};

// check thai phone number format
export const isValidThaiPhoneNumber = (phone) => {
    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, "");

    // Check for mobile numbers (10 digits, starts with 06, 08, or 09)
    if (/^(06|08|09)\d{8}$/.test(digits)) return true;

    // Check for landline numbers (9 digits, starts with 0)
    if (/^0\d{8}$/.test(digits)) return true;

    return false;
};