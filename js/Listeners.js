/**
 * Will hold a list of listeners that are created and should be notified on events
 *
 * @example
 * AppAPI.addListeners({
 *  afterCreated: function() {
 *      AppAPI.Article.setSource('Ny Times');
 *  },
 *  pluginElementSelected: function() {
 *      alert('You cliked me!');
 *  },
 *  beforeSave: function() {
 *      if (!articleIsAwesome()) {
 *          return false;
 *      }
 *  }
 * });
 *
 * @description
 * Used for event handling in the App API. The only function an app developer needs to care about it the 'addListeners' event, and you can see an example of it down bellow.
 *
 * If an event function returns false (as in the beforeSave example) the event will be stopped. This works for all events, but only makes sense for the before* events.
 *
 * *Available events are:*
 *
 *  `afterCreated`
 *
 *  `afterDeleted`
 *
 *  `afterLoaded`
 *
 *  `afterPublished`
 *
 *  `afterSave`
 *
 *  `beforeCreated`
 *
 *  `beforeLoaded`
 *
 *  `beforePreview`
 *
 *  `beforeSave`
 *
 *  `beforePublished`
 *
 *  `editorFocus`
 *
 *  `editorReady`
 *
 *  `modifiedContent`
 *
 *  `pluginElementClicked`
 *
 *  `pluginElementSelected`
 *
 *  `pluginElementDeselected`
 */
function Listeners () {
	this._listeners = [];
}

/**
 * Adds several listeners
 *
 * @param {Object} events A list of callbacks that should be called on events
 * @returns {Object} A dictionary of events => listener ID for later removal
 */
Listeners.prototype.addAll = function(events) {

	var out = {};
	for (var event in events) {
		out[event] = this.add(event, events[event]);
	}

	return out;
};

/**
 * Adds a new listener
 *
 * @param {String} event Event name
 * @param {Function} callback Function to call when an even of the type is received
 */
Listeners.prototype.add = function(event, callback) {

	if (this._listeners[event] === undefined) {
		this._listeners[event] = [];
	}

	var index = this._listeners[event].length;
	this._listeners[event][index] = callback;
	return index;
};

/**
 * Removes the listener at the given index
 *
 * @param {String} event Event type
 * @param {Function} index The index of the event handler to remove
 */
Listeners.prototype.remove = function(event, index) {

	if (this._listeners[event] === undefined || this._listeners[event][index] === undefined) {
        return;
    }

	/*
	 * Set to null instead of remove to retain callback indexes
	 */
	this._listeners[event][index] = false;
};

/**
 * Removes the first matching listener by callback lookup (if you don't have the index)
 *
 * @param {String} event Event type
 * @param {Function} callback Function originally bound to event type
 * @returns {Boolean} Whether a handler was removed
 */
Listeners.prototype.removeByCallback = function(event, callback) {

	$.each(this._listeners[event], function(i, e) {
		if (e === callback) {
			this.remove(event, i);
			return true;
		}
	});

	return false;
};

/**
 * Removes all listeners for the given event type, or if !event then removes all listeners
 *
 * @param {String} event Event type to remove handlers for (!event for all)
 */
Listeners.prototype.removeAll = function(event) {
	if (!event) {
		this._listeners = [];
	} else {
		this._listeners[event] = [];
	}
};

/**
 * Notifies all registered listeners that an event has occurred
 *
 * @param {String} event Event type
 * @param {Object} data The event data
 */
Listeners.prototype.notify = function(event, data) {
    var returnValue = true;
	if (this._listeners[event] !== undefined) {
		jQuery.each(this._listeners[event], function(i, e) {
			if (e && typeof e === "function") {
				if (data && data.params && data.params === true) {
					var r = e.apply(void 0, data.data);
					if (r === false) {
						returnValue = false;
					}
					
				} else if (e(data) === false) {
                    returnValue = false;
                }
			}
		});
	}
	return returnValue;
};
