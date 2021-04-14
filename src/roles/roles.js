const AccessControl = require('accesscontrol')
const ac = new AccessControl()

exports.roles = (function () {
    ac.grant('patient')
        .readOwn('profile')
        .updateOwn('profile')
        .readAny('profile')

    ac.grant('doctor')
        .extend('basic')
        .readAny('profile')

    ac.grant('admin')
        .extend('basic')
        .extend('supervisor')
        .updateAny('profile')
        .deleteAny('profile')

    return ac
})()