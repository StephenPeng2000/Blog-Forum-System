global.tools = {

    /**
     * Save login admin information
     */
    setLoginAdmin: function (loginUser) {
        global.SessionStorage.set(global.SessionStorage.SESSION_KEY_LOGIN_ADMIN, loginUser);
    },

    /**
     * Get login admin information
     */
    getLoginAdmin: function () {
        return global.SessionStorage.get(global.SessionStorage.SESSION_KEY_LOGIN_ADMIN) || "";
    },

    /**
     * Empty check null or "" both return true
     */
    isEmpty: function (obj) {
        if ((typeof obj === 'string')) {
            return !obj || obj.replace(/\s+/g, "") === ""
        } else {
            return (!obj || JSON.stringify(obj) === "{}" || obj.length === 0);
        }
    },

    /**
     * Non-empty validation
     */
    isNotEmpty: function (obj) {
        return !this.isEmpty(obj);
    }

};
