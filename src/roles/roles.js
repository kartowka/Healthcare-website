const AccessControl = require('accesscontrol')
const ac = new AccessControl()

const doctor_attri = ['doctor_settings', 'doctor_appointment_summary', 'doctor_future_appointments']
const patient_attri = ['patient_settings', 'patient_appointment_summary', 'patient_future_appointments', 'patient_previous_appointments']

exports.roles = (function () {
    ac.grant('patient')
        .readOwn('patient_profile')
        .readOwn(patient_attri)
        .updateOwn('patient_profile')
        .readAny('doctor_profile')
        .updateOwn(patient_attri)

    ac.deny('patient')
        .readAny(doctor_attri)
    
    ac.grant('doctor')
        .readOwn(doctor_attri)
        .updateOwn('doctor_profile')
        .readAny(['patient_profile', 'doctor_profile'])
        .deleteAny('forumQuestions')

    ac.deny('doctor')
        .readAny(patient_attri)

    ac.grant('admin')
        .readAny(doctor_attri)
        .readAny(patient_attri)
        .readAny(['patient_profile', 'doctor_profile', 'admin_interface'])
        .updateAny(['patient_profile', 'doctor_profile', 'admin_interface'])
        .deleteAny(['patient_profile', 'doctor_profile', 'admin_interface'])
    
    return ac
})()