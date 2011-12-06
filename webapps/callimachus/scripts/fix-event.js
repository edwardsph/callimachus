// fix-event.js
/*
   Copyright (c) 2011 3 Round Stones Inc, Some Rights Reserved
   Licensed under the Apache License, Version 2.0, http://www.apache.org/licenses/LICENSE-2.0
*/

/*
 * calli.asEvent wraps an event is a jQuery.Event object. If an event is not
 * passed as a parameter this method will find it by looking at window.event
 * or walking up the caller hierarchy to find it.
 *
 * The event may be lost when a jQuery initiated event was called on an
 * attribute handler in IE. Since jQuery has no way to pass the event object to
 * function handlers that take no arguments.
 */
 
(function($,jQuery){
	// tell jQuery to copy the dataTransfer property from events over if it exists
 	jQuery.event.props.push("dataTransfer");
 	jQuery.event.props.push("source");
 	jQuery.event.props.push("data");
 
	if (!window.calli) window.calli = {};
	window.calli.fixEvent = function(event) {
		if (event && event.originalEvent)
			return event; // already a jQuery Event
		if (!event && window.event) event = window.event;
		if (!event) {
			// event variable was lost (IE!), go find it up the stack trace
			var caller = arguments.callee.caller;
			var evt = caller.arguments[0];
			while (caller && (!evt || !evt.type)) {
				evt = caller.arguments[0];
				caller = caller.arguments.callee.caller;
			}
			if (!caller) return event; // couldn't find it
			event = evt;
		}
		return jQuery.event.fix(event);
	};
})(jQuery,jQuery);
