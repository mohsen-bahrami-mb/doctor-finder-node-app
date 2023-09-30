// import modules
import autoBind from "auto-bind";
// import controllers
import response from "./response";
import checkValidateErr, { ValidateErr } from "./validator";
import { createUsername } from "./createUniqueName";
import devicesLimit from "./devicesLimit";
import checkJwt from "./checkJwt";
import { createSession, updateSession, logout } from "./session";
import { updateSelfAccount, updateOtherAccount } from "./account";
import { createRoute, updateRoute, getManyRoute, getOneRoute, deleteOneRoute } from "./route";
import { deleteProfilePhoto, renameOne, readDir, createDir, deleteOne, copyOne } from "./file";
// import middlewares
// import modules types
// import models

// export other modules
export {
    response, checkValidateErr, ValidateErr, createUsername, createSession, updateSession, logout, updateSelfAccount, updateOtherAccount,
    devicesLimit, checkJwt, createRoute, updateRoute, getManyRoute, getOneRoute, deleteOneRoute, deleteProfilePhoto,
    renameOne, readDir, createDir, deleteOne, copyOne
};

// export main modules
export default class {
    constructor() {
        /**
         * "auto-bind" package:
         * bind "this" to middlewares functionality, when use in routes.
         * when use "this" at Inheritance,
         * needs to use this "Class" to run these functions or any functions in childerns.
        */
        autoBind(this);
        () => { }
    }
}