const AccessControl = require('accesscontrol')
const ac = new AccessControl()

const doctor_paths = ['doctor_settings', 'doctor_appointment_summary', 'doctor_future_appointments','doctor_Review']
const patient_paths = ['patient_settings', 'patient_appointment_summary', 'patient_future_appointments', 'patient_previous_appointments']
const admin_paths = ['doctor_settings', 'doctor_appointment_summary', 'doctor_future_appointments','doctor_Review','patient_settings', 'patient_appointment_summary', 'patient_future_appointments', 'patient_previous_appointments','admin_interface']

exports.roles = (function () {
    ac.grant('patient')
        .readOwn('patient_profile')
        .readOwn(patient_paths)
        .updateOwn(patient_paths)
        .readAny('doctor_profile')       
    
    ac.grant('doctor')
        .readAny('doctor_profile')
        .readOwn(doctor_paths)
        .updateOwn(doctor_paths)
        .readOwn('patient_profile')

    ac.grant('admin')
        .extend('patient')
        .extend('doctor')
        .readAny(admin_paths)
        .updateAny(admin_paths)
        .deleteAny(admin_paths)
     
    
    return ac
})()