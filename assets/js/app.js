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

        // Instantiate the indicator element.
        const indicator = '<span class="acf-required-indicator">*</span>';

        // Remove all previous indicators.
        $( 'span.acf-required-indicator' ).remove();

        // Loob through all ACF tab fields
        $( '.acf-field-tab' ).each( ( index, element ) => {
            const name = $( element ).data( 'name' );
            const $button = $( 'a.acf-tab-button[data-key="' + name + '"]' );
            let hasError = false;

            // Find all fields in tab
            $( element ).nextUntil( 'div.acf-field[data-key="' + name + '"]' ).each( ( index, element ) => {

                // Count possible validation errors in the tab.
                let errors = $( element ).find( 'div.acf-error-message' );

                if ( errors.length > 0 ) {
                    hasError = true;
                }
            });

            // If there are errors, show the indicator.
            if ( hasError ) {
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
     * Code that runs in document ready.
     */
    docReady() {

        // Hook into ACF validation failure action.
        acf.add_action( 'validation_failure', () => {

            // Check if we have triggered the validation manually.
            if ( window.checkFieldsTriggered ) {
                window.checkFieldsTriggered = false;

                // Hide the error messages for now.
                this.changeCSS( 'acf-global.css', '.acf-error-message', 'display', 'none' );
                this.changeCSS( 'acf-input.css', '.acf-field .acf-error-message', 'display', 'none' );

                // Wait a second for the error messages to be created.
                setTimeout( () => {

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

        rt.docReady();
    }
});
