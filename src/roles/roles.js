const AccessControl = require('accesscontrol')
const ac = new AccessControl()

const doctor_paths = ['doctor_settings', 'doctor_appointment_summary', 'doctor_future_appointments','doctor_Review']
const patient_paths = ['patient_settings', 'patient_appointment_summary', 'patient_future_appointments', 'patient_previous_appointments']
const admin_paths = ['doctor_settings', 'doctor_appointment_summary', 'doctor_future_appointments','doctor_Review','patient_settings', 'patient_appointment_summary', 'patient_future_appointments', 'patient_previous_appointments','admin_interface', 'appointment_management']
const forum_pages_paths = ['forum', 'sub_forum', 'conversation']
const forum_action_paths = ['new_forum', 'edit_forum']
const sub_forum_action_paths = ['new_question', 'edit_question','new_comment', 'edit_comment']

exports.roles = (function () {
    ac.grant('patient')
        .readOwn('patient_profile')
        .readOwn(patient_paths)
        .readOwn(sub_forum_action_paths)
        .readAny(forum_pages_paths)
        .updateOwn(patient_paths)
        .readAny('doctor_profile')
        .readAny('appointment_management')   
        .updateAny('appointment_management')    
    
    ac.grant('doctor')
        .readAny('doctor_profile')
        .readAny(sub_forum_action_paths)
        .readAny(forum_pages_paths)
        .readOwn(forum_action_paths)
        .readOwn(doctor_paths)
        .updateOwn(doctor_paths)
        .readOwn('patient_profile')
        .readAny('appointment_management')   
        .updateAny('appointment_management')   

    ac.grant('admin')
        .extend('patient')
        .extend('doctor')
        .readAny(admin_paths)
        .updateAny(admin_paths)
        .deleteAny(admin_paths)
     
    return ac
})()