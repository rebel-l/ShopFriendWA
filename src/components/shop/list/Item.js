import React, {Component} from 'react';
import styles from './Item.scss';

import {connect} from 'react-redux';
import {editItem, removeItem, activateItem, deactivateItem} from '../../../redux/actions/shop/list/item';

/**
 * cancelTimeout is the time the user can abort the deactivation of an item.
 *
 * @type {number}
 */
const cancelTimeout = 2000; // ms

/**
 * progressInterval is the interval to update the progress bar once the user deactivates an item.
 *
 * @type {number}
 */
const progressInterval = 10; // ms

/**
 * Item is the UI component for one item in the shopping list.
 */
class Item extends Component {
    constructor(props) {
        super(props);

        // init attributes
        this.item = props.item;
        this.timer = null;

        // init state
        this.state = {
            progress: 0 + '%',
            active: true, // TODO: think of using it from item itself?
            contextMenu: false
        };

        // register event handler
        this.handleActivate = this.handleActivate.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleSwipe = this.handleSwipe.bind(this);
    }

    /**
     * handleActivate deals with de-/ activating an item by user. It steers the progress bar until it times out or the
     * user cancels the deactivation.
     * Activation the item happens immediately.
     *
     * @param id {number|string}
     */
    handleActivate(id) {
        if (this.isActive() && this.timer === null) {
            this.deactivate();

            // delay re-rendering shopping list depending on user action
            let iterations = cancelTimeout / progressInterval;
            let step = 100 / iterations;
            let counter = 0;
            let self = this;
            this.timer = setInterval(function () {
                counter++;
                let progress = counter * step;

                if (counter < iterations) {
                    self.setProgress(progress);
                } else {
                    // we have timed out, item is deactivated
                    self.resetTimer();
                    self.props.deactivateItem(id);
                }
            }, progressInterval);
        } else {
            // deactivating item was canceled by user
            this.activate(id);
            this.resetTimer();
        }
    }

    /**
     * handleEdit loads the item into the Editor for change by user.
     */
    handleEdit() {
        this.props.editItem(this.item);
        this.setState({contextMenu: false});
    }

    /**
     * handleDelete removes the item from the shopping list.
     *
     * @param id {number|string}
     */
    handleDelete(id) {
        this.props.removeItem(id);
    }

    /**
     * resetTimer resets the timer and progress bar.
     */
    resetTimer() {
        this.setProgress(0);
        clearInterval(this.timer);
        this.timer = null;
    }

    /**
     * setProgress is used to animate the progress bar.
     *
     * @param value {number}
     */
    setProgress(value) {
        this.setState({progress: value + '%'});
    }

    /**
     * activate will activate the item.
     *
     * @param id {number|string}
     */
    activate(id) {
        this.props.activateItem(id);
        this.setState({active: true});
        this.setState({contextMenu: false});
    }

    /**
     * deactivate will deactivate the item.
     */
    deactivate() {
        this.setState({active: false});
        this.setState({contextMenu: false});
    }

    /**
     * isActive returns the active state of item.
     *
     * @returns {boolean}
     */
    isActive() {
        return this.state.active;
    }

    /**
     * handleSwipe opens the context menu as soon as an user swipes on an item.
     */
    handleSwipe() {
        this.setState({contextMenu: true});
    }

    render() {
        let containerStyle = styles.progressContainer;
        let contentStyle = this.state.active ? styles.progress : styles.progressInactive;
        let buttonStyle = '';

        if (this.state.contextMenu) {
            buttonStyle = styles.contextMenu;
            containerStyle += ' ' + styles.contextMenu;
        }

        return (
            <div className={styles.item}>
                <div className={styles.inner}>
                    <div className={containerStyle}
                         onClick={() => this.handleActivate(this.item.id)}
                         onTouchMove={this.handleSwipe}>
                        <div className={contentStyle} style={{width: this.state.progress}}>{this.item.toString()}</div>
                    </div>
                    <button onClick={this.handleEdit} className={buttonStyle}>
                        edit
                    </button>
                    <button onClick={() => this.handleDelete(this.item.id)} className={buttonStyle}>
                        delete
                    </button>
                </div>
            </div>
        );
    }
}

export default connect(null, {removeItem, editItem, activateItem, deactivateItem})(Item);
