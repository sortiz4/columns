export class Columns {
    /**
     * Initializes the layout and attaches an event listener to the window.
     */
    constructor(el, sizes) {
        // Normalize the element
        if(typeof el === 'string') {
            el = document.querySelector(el);
        } else if(!(el instanceof Element)) {
            throw new TypeError('Unrecognized element type');
        }
        this._el = el;
        this._sizes = sizes;

        // Initialize the layout
        el.style.position = 'relative';
        for(const child of el.children) {
            child.style.position = 'absolute';
        }
        this._update();

        // Attach the event listener
        this._event = this._update.bind(this);
        window.addEventListener('resize', this._event);
    }

    /**
     * Selects the appropriate properties based on the width of the window.
     */
    _props() {
        for(let i = this._sizes.length - 1; i >= 0; i--) {
            if(
                this._sizes[i].hasOwnProperty('min') &&
                this._sizes[i].min <= window.innerWidth
            ) {
                return this._sizes[i];
            }
        }
        return this._sizes[0];
    }

    /**
     * Updates the layout using the appropriate properties.
     */
    _update() {
        const props = this._props(); // Collect the properties
        let containerHeight = 0; // Height of the tallest column
        let elementWidth = 0; // Width of each child element
        let offsetX = 0; // Horizontal offset for the next child
        let offsetY = 0; // Vertical offset for the next child

        // Iterate over the number of columns
        for(let i = 0; i < props.columns; i++) {
            offsetY = 0;

            // Iterate over each column element
            for(let j = i; j < this._el.children.length; j += props.columns) {

                // Update the childs position
                const child = this._el.children[j];
                child.style.left = `${offsetX}px`;
                child.style.top = `${offsetY}px`;

                // Update the vertical offset for the next child
                offsetY += child.offsetHeight + props.gutter;

                // Update the latest element width with each child
                elementWidth = child.offsetWidth;
            }

            // Update the horizontal offset for each column
            offsetX += elementWidth + props.gutter;

            // Remove the last vertical gutter
            offsetY -= props.gutter;

            // Update the container height to fit the largest column
            if(offsetY > containerHeight) {
                containerHeight = offsetY;
            }
        }

        // Apply the container height
        this._el.style.height = `${containerHeight}px`;
    }

    /**
     * Resets the layout and detaches the event listener.
     */
    destroy() {
        return this.reset().detach();
    }

    /**
     * Detaches the event listener from the window.
     */
    detach() {
        window.removeEventListener('resize', this._event);
        return this;
    }

    /**
     * Resets the layout to its original state.
     */
    reset() {
        this._el.style.height = null;
        this._el.style.position = null;
        for(const child of this._el.children) {
            child.style.top = null;
            child.style.left = null;
            child.style.position = null;
        }
        return this;
    }
}
