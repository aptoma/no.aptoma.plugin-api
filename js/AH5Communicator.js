/* global AppAPI: true */
/**
 * This will be used by editor apps to communicate with the editor
 *
 * Should be used like this:
 *
 * AppAPI.Editor.insert('string');
 *
 * @class
 * @classdesc Functions for talking with the AH5 editor. Accessed through AppAPI.Editor
 */
var AH5Communicator = {
	/**
	 * Get name of current active editor
     * 
	 * @param {function} callback function(String)
	 */
	getActiveEditor: function (callback) {
		AppAPI.request('get-active-editor', null, callback);
	},
	/**
	 * Registers/Modifies a context menu items for a app element
	 * The object send should have the following structure
	 *
	 * @param {Object} action The action object
	 * @param {function} callback function()
     *
     * @example
	 * AppAPI.Editor.registerMenuAction({
	 *      app: 'name of the app to register the new element on',
	 *      label: 'label in the menu',
	 *      icon: 'optional url to possible icon image',
	 *      trigger: 'optional css selector, only show menu element when this matches the element',
	 *      callback: function(id) {
	 *          // callback function, paramter is the id of the element clicked
	 *      }
	 * })
	 */
	registerMenuAction: function (action, callback) {
		AppAPI.request('register-menu-action', action, callback);
	},

	/**
	 * Registers/Modifies a group of items to in the context menu
	 * The object send should have the following structure
     *
     * @example
	 * AppAPI.Editor.registerMenuActionGroup({
	 *      app: 'name of the app to register the new element on',
	 *      label: 'label for the group in the menu',
	 *      icon: 'optional url to possible icon image',
	 *      actions: [
	 *          {
	 *              label: 'label for the action #1',
	 *              callback: function(id) {
	 *                  // callback function, paramter is the id of the element clicked
	 *              }
	 *          },
	 *          {
	 *              label: 'label for the action #2',
	 *              callback: function(id) {
	 *                  // callback function, paramter is the id of the element clicked
	 *              }
	 *          }
	 *      ]
	 * })
	 *
	 * @param {Object} action The action object
	 * @param {function} callback function()
	 */
	registerMenuActionGroup: function (group, callback) {
		AppAPI.request('register-menu-action-group', group, function(typeNames) {
			if (typeNames.length !== group.actions.length) {
				if (this.DEBUG) {
                    console.warn('wrong amount of callback events recieved, not good');
                }
				return;
			}
            var createMenuAction = function(func) {
                if (typeof func === 'function') {
                    return function(data) {
                        func(data.id);
                    };
                } else {
                    return function() {};
                }
            };
			for (var i=0; i<typeNames.length; i++) {
				var menuAction = createMenuAction(group.actions[i].callback);

				AppAPI.eventListeners.add(typeNames[i], menuAction);
			}

            callback(typeNames);
		});
	},

	/**
	 * Retrieves the type of editor that currently has focus
	 *
	 * @param {function} callback function(String)
	 */
	getEditorType: function(callback) {
		AppAPI.request('editor-get-type', null, callback);
	},

	/**
	 * Replace an element in the article
	 *
	 * @param {String} id Id of the element
	 * @param {String} element The new element
	 * @param {function} callback function(Boolean), called after replacement is done
	 */
	replaceElementById: function(id, element, callback) {
		AppAPI.request('editor-element-replace-byid', {
			id: id,
			element: element
		}, callback);
	},

	/**
	 * Get HTML code of an element
	 *
	 * @param {String} id The element id
	 * @param {function} callback function(String), html content of the element
	 */
	getHTMLById: function(id, callback) {
		AppAPI.request('editor-element-get-byid', {
			id: id
		}, callback);
	},

	/**
	 * Get HTML code of all elements that match the selector
	 *
	 * @param {String} selector The CSS selector
	 * @param {function} callback function([String]), html content of matching elements
	 */
	getHTMLBySelector: function(selector, callback) {
		AppAPI.request('editor-elements-get-byselector', {
			selector: selector
		}, callback);
	},

	/**
	 * Get all categories
	 *
	 * @param {Function} callback function([Object Category]), list of Category objects with id, name and pid
	 */
	getCategories: function(callback) {
		AppAPI.request('get-categories', null, callback);
	},

	/**
	 * Returns all the parent categories of the given category
	 *
	 * @param {Object} category The category to find parents of
	 * @param {Function} callback function([Object Category]), array of parent Category objects
	 */
	getParentCategories: function(category, callback) {
		AppAPI.request('get-parent-categories', category, callback);
	},

	/**
	 * Returns all the parent elements that match the selector
	 *
	 * @param {String} id Id of element to find parents of
	 * @param {String} selector Selector to filter parent elements with
	 * @param {Function} callback function([String]), array of ids
	 */
	getParentIds: function(id, selector, callback) {
		AppAPI.request('get-parent-ids', {
            id: id,
            selector: selector
        }, callback);
	},

	/**
	 * Retrieve information about all tagtypes
	 *
	 * @param {Function} callback function([Object Tagtype]), array of tagtypes with id, name and config object
	 */
	getTagTypes: function(callback) {
		AppAPI.request('get-tag-types', null, callback);
	},

	/**
	 * Get information about the given tagtype
	 *
	 * @param {String} id The element id
	 * @param {Function} callback function(Object Tagtype), tagtype object with id, name and config object
	 */
	getTagType: function(id, callback) {
		AppAPI.request('get-tag-type', {
			id: id
		}, callback);
	},

	/**
	 * Clears the editor contents
	 *
	 * @param {Function} callback function(Boolean)
	 */
	clear: function(callback) {
		AppAPI.request('editor-clear', null, callback);
	},

	/**
	 * Insert a string into the editor
	 *
	 * @param {String} string The string that should be inserted
	 * @param {Function} callback function(String), id of the newly inserted element if it has one
	 */
	insertString: function(string, callback) {
		AppAPI.request('editor-insert-string', {
			string: string
		}, callback);
	},

	/**
	 * Insert an element into the editor
	 *
	 * Note that the HTML of the element is what will be transferred, and nothing else!
	 * The element will be given the class dp-app-element, and given a unique ID (if none is present)
	 *
	 * @param {Element} element The element that should be inserted
	 * @param {Function} callback function(String), id of the newly inserted element
	 */
	insertElement: function(element, callback) {
		var e = jQuery(element);
		AppAPI.request('editor-insert-element', {
			element: jQuery('<div>').append(element).html()
		}, callback);
	},

	/**
	 * Remove classes from the element an element in the article
	 *
	 * @param {String} id Id of the element
	 * @param {Array} classes Array of class names
	 * @param {function} callback function(Boolean)
	 */
	removeClasses: function(id, classes, callback) {
		AppAPI.request('editor-classes-remove', {
			id: id,
			classes: classes
		}, callback);
	},

	/**
	 * Add new classes to an element
	 *
	 * @param {String} id Id of the element
	 * @param {Array} classes Array of class names
	 * @param {function} callback function(Boolean)
	 */
	addClasses: function(id, classes, callback) {
		AppAPI.request('editor-classes-add', {
			id: id,
			classes: classes
		}, callback);
	},

	/**
	 * Mark an element as currently selected (green border with default styling)
	 *
	 * @param {String} id Id of the element
	 * @param {function} callback function(Boolean)
	 */
	markAsActive: function(id, callback) {
		AppAPI.request('editor-mark-as-active', {
			id: id
		}, callback);
	},

	/**
	 * Sets the attribute of the element with the given ID to value
	 *
	 * @param {String} id The ID of the element to set the attribute on
	 * @param {String} attribute The attribute to set
	 * @param {String} value What to set the attribute to
	 * @param {Function} callback function(Boolean)
	 */
	setAttributeById: function(id, attribute, value, callback) {
		AppAPI.request('editor-element-attribute-set-byid', {
			id: id,
			attribute: attribute,
			value: value
		}, callback);
	},

	/**
	 * Sets a style of the element with the given ID to value
	 *
	 * @param {String} id The ID of the element to set the attribute on
	 * @param {String} attribute The style attribute to set
	 * @param {String} value What to set the attribute to
	 * @param {Function} callback function(Boolean)
	 */
	setStyleById: function(id, attribute, value, callback) {
		AppAPI.request('editor-element-style-set-byid', {
			id: id,
			attribute: attribute,
			value: value
		}, callback);
	},

	/**
	 * Initialize pre registered menus
     *
	 * Available options are: simplePluginMenu, editContext
	 *
	 * @param {Array} menus Array of menu names
	 * @param {Function} callback function(Boolean)
	 */
	initMenu: function(menus, callback) {
		AppAPI.request('editor-initialize-menu', {
			menus: menus
		}, callback);
	}

};

AppAPI.Editor = AH5Communicator;
