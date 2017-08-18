module.exports = class Columns {
    /**
     * this.el    - A container element
     * this.sizes - A list of column properties
     * this.event - A bound copy of the update method
     */

    /**
     * Initializes the layout and attaches an event listener to the window.
     * Sizes must be given in ascending order (media queries are assumed to
     * be the minimum width of the window in pixels).
     */
    constructor(el, sizes) {

        // Normalize the element
        if(typeof el === 'string') {
            el = document.querySelector(el);
        } else if(!(el instanceof Element)) {
            throw new TypeError('Unrecognized element type.');
        }
        this.el = el;
        this.sizes = sizes;

        // Initialize the layout
        this.el.style.position = 'relative';
        for(let child of this.el.children) {
            child.style.position = 'absolute';
        }
        this.update();

        // Attach an event listener
        this.event = this.update.bind(this);        
        window.addEventListener('resize', this.event);
    }

    /**
     * Resets the layout and detaches the event listener.
     */
    destroy() {
        this.reset();
        this.detach();
    }

    /**
     * Detaches the event listener from the window.
     */
    detach() {
        window.removeEventListener('resize', this.event);
    }

    /**
     * Resets the layout to its original state (modified properties only).
     */
    reset() {
        this.el.style.height = null;
        this.el.style.position = null;
        for(let child of this.el.children) {
            child.style.top = null;
            child.style.left = null;
            child.style.position = null;
        }
    }

    /**
     * Selects the appropriate properties based on the width of the window.
     * @private
     */
    props() {
        for(let i = this.sizes.length-1; i >= 0; i--) {
            if(this.sizes[i].hasOwnProperty('min') && this.sizes[i].min <= window.innerWidth) {
                return this.sizes[i];
            }
        }
        return this.sizes[0];
    }

    /**
     * Updates the layout using the appropriate properties.
     * @private
     */
    update() {
        let props = this.props(); // Layout properties (based on window size)
        let containerHeight = 0;  // New container height (largest column)
        let elementWidth = 0; // Width of each element (constant)
        let offsetX = 0; // Horizontal offset for the next child
        let offsetY = 0; // Vertical offset for the next child

        // Iterate over the number of columns
        for(let i = 0; i < props.columns; i++) {
            offsetY = 0; // Reset the vertical offset for each column

            // Iterate over each column element
            for(let j = i; j < this.el.children.length; j += props.columns) {

                // Update the child offset
                let child = this.el.children[j];
                child.style.left = `${offsetX}px`;
                child.style.top = `${offsetY}px`;

                // Update the vertical offset for the next child
                offsetY += child.offsetHeight + props.gutter;

                // Update the latest element width with each iteration
                // (this fixes a minor alignment bug on initialization)
                elementWidth = child.offsetWidth;
            }

            // Update the horizontal offset for each column
            // and remove the latest vertical gutter addition
            offsetX += elementWidth + props.gutter;
            offsetY -= props.gutter;

            // Update the container height to fit the largest column
            if(offsetY > containerHeight) {
                containerHeight = offsetY;
            }
        }

        // Apply the container height
        this.el.style.height = `${containerHeight}px`;
    }
}
