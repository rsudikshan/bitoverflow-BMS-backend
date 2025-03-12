import { Roles } from "../enums/roles";
import { Permissions } from "../enums/permissions";

export const RolePermissionMap = {
    [Roles.USER] : [
        Permissions.CLIENT_CREATE,
        Permissions.CLIENT_READ,
        Permissions.CLIENT_UPDATE,
        Permissions.CLIENT_DELETE,
    ],
    [Roles.ADMIN] : [
        Permissions.CLIENT_CREATE,
        Permissions.CLIENT_READ,
        Permissions.CLIENT_UPDATE,
        Permissions.CLIENT_DELETE,
        Permissions.ADMIN_CREATE,
        Permissions.ADMIN_READ,
        Permissions.ADMIN_UPDATE,
        Permissions.ADMIN_DELETE
    ]
}