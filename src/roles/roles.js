const AccessControl = require('accesscontrol')
const ac = new AccessControl()

const patient_denies = ['doctor_settings', 'doctor_appointment_summary', 'doctor_future_appointments']
const doctor_denies = ['patient_settings', 'patient_appointment_summary', 'patient_future_appointments']

exports.roles = (function () {
    ac.grant('patient')
        .readOwn('patient_profile')
        .updateOwn('patient_profile')
        .readAny('doctor_profile')

    ac.deny('patient')
    .readAny(patient_denies)
    
    ac.grant('doctor')
        .updateOwn('doctor_profile')
        .readAny(['patient_profile', 'doctor_profile'])
        .deleteAny('forumQuestions')

    ac.deny('doctor')
        .readAny(doctor_denies)

    ac.grant('admin')
        .readAny(patient_denies)
        .readAny(doctor_denies)
        .readAny(['patient_profile', 'doctor_profile', 'admin_interface'])
        .updateAny(['patient_profile', 'doctor_profile', 'admin_interface'])
        .deleteAny(['patient_profile', 'doctor_profile', 'admin_interface'])
    
    return ac
})()