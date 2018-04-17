require( __dirname + '/../styles/app.scss' );

/**
 * JavaScript class for ACF Required Tabs WordPress plugin
 */
class RequiredTabs {

    /**
     * An empty constructor.
     */
    constructor() {}

    /**
     * Checks for error messages within the tabs and adds the indicator to the button if needed.
     */
    checkFields() {
        this.debug( 'checking fields' );

        // Instantiate the indicator element.
        const indicator = '<span class="acf-required-indicator">*</span>';

        // Remove all previous indicators.
        $( 'span.acf-required-indicator' ).remove();

        // Loob through all ACF tab fields
        $( '.acf-field-tab' ).each( ( index, element ) => {
            this.debug( 'found a tab' );

            const key = $( element ).data( 'key' );
            const $button = $( 'a.acf-tab-button[data-key="' + key + '"]' );
            let hasError = false;

            // Find all fields in tab
            $( element ).nextUntil( 'div.acf-field[data-key="' + key + '"]' ).each( ( index, element ) => {
                this.debug( 'found a field inside a tab' );

                // Count possible validation errors in the tab.
                let errors = $( element ).find( 'div.acf-error-message' );

                if ( errors.length > 0 ) {
                    this.debug( 'yes, there are errors' );
                    hasError = true;
                }
            });

            // If there are errors, show the indicator.
            if ( hasError ) {
                this.debug( 'had an error, appending to', $button );
                $button.append( $( indicator ) );
            }
        });
    }

    /**
     * Changes the browser stylesheet stack.
     * 
     * @param {*} stylesheet Filename or whole path of the stylesheet to modify.
     * @param {*} selector   Selector of which the rules will be modified.
     * @param {*} newRule    The rule to be added. 
     * @param {*} newValue   The value to be added.
     */
    changeCSS( stylesheet, selector, newRule, newValue ) {
        let thisCSS, target;

        // Loop through the document stylesheets to find the right one.
        for ( let sheet of document.styleSheets ) {
            if ( ! sheet.href ) {
                continue;
            }

            const href = sheet.href;

            // If sheet's href element contains the wanted string, it's the one we want.
            if ( href.includes( stylesheet ) ) {
                thisCSS = sheet;
                break;
            }
        }

        // If there was no stylesheet with that name, through an error.
        if ( typeof thisCSS === 'undefined' ) {
            console.error( 'Stylesheet "' + stylesheet + '" not found.'  );
            return;
        }

        // Make the script work with IE and Safari as well.
        let ruleSearch = thisCSS.cssRules ? thisCSS.cssRules : thisCSS.rules;

        // Find the rule we want.
        for ( let rule of ruleSearch ) {
            if ( rule.selectorText == selector ) {
                target = rule;
                break;
            }
        }

        // Alter the rule.
        target.style[ newRule ] = newValue;
    }

    /**
     * Console.log debugs if we need them to show
     * 
     * @param {*} items 
     */
    debug( ...items ) {
        if ( this.debugOn ) {
            console.log( ...items );
        }
    }

    /**
     * Code that runs in document ready.
     */
    docReady() {
        this.debug( 'rt docReady' );

        this.tabs = $( '.acf-field-tab' );

        if ( this.tabs.length === 0 ) {
            this.debug( 'no tabs found, bailing' );
            return;
        }

        // Hook into ACF validation failure action.
        acf.add_action( 'validation_failure', () => {
            this.debug( 'validation failure' );

            // Check if we have triggered the validation manually.
            if ( window.checkFieldsTriggered ) {
                this.debug( 'triggered manually' );

                window.checkFieldsTriggered = false;

                // Hide the error messages for now.
                this.changeCSS( 'acf-global.css', '.acf-error-message', 'display', 'none' );
                this.changeCSS( 'acf-input.css', '.acf-field .acf-error-message', 'display', 'none' );

                // Wait a second for the error messages to be created.
                setTimeout( () => {
                    this.debug( 'waited a second' );

                    this.checkFields();

                    // Remove all error messages
                    $( 'div.acf-error-message' ).remove();

                    // After the error messages have been removed, we can add the CSS rules back.
                    setTimeout( () => {
                        this.changeCSS( 'acf-global.css', '.acf-error-message', 'display', 'block' );
                        this.changeCSS( 'acf-input.css', '.acf-field .acf-error-message', 'display', 'inline-block' );
                    }, 1000 );
                }, 1000 );
            } else {

                // Run the checkFields function even if we haven't triggered the validation ourselves.
                setTimeout( () => {
                    this.checkFields();
                }, 1000 );
            }
        });

        // Hook into ACF validation success action.
        acf.add_action( 'validation_success', () => {
            this.debug( 'validation success' );

            // Check if we have triggered the validation manually.
            if ( window.checkFieldsTriggered ) {
                window.checkFieldsTriggered = false;

                // Set the validation rule to be false so that the form wouldn't get sent.
                acf.validation.valid = false;
            }
        });

        // Trigger the validation.
        window.checkFieldsTriggered = true;
        acf.validation.fetch( jQuery( 'form' ) );
    }
}

jQuery( document ).ready( function( $ ) {
    if ( typeof acf !== 'undefined' ) {
        const rt = new RequiredTabs();

        rt.debugOn = false;

        rt.docReady();
    }
});
