import React from "react";
import classnames from "classnames";
import assign from "object-assign";
import monitor from "../monitor";
import MenuWrapper from "./wrapper";

const menuStyles = {
    position: "relative",
    zIndex: "auto"
};

let SubMenu = React.createClass({
    displayName: "SubMenu",
    propTypes: {
        title: React.PropTypes.string.isRequired,
        disabled: React.PropTypes.bool,
        hoverDelay: React.PropTypes.number
    },
    getDefaultProps() {
        return {
            hoverDelay: 500
        };
    },
    getInitialState() {
        return {
            visible: false
        };
    },
    shouldComponentUpdate(nextProps, nextState) {
        return this.state.isVisible !== nextState.visible;
    },
    componentWillUnmount() {
        if (this.opentimer) clearTimeout(this.opentimer);

        if (this.closetimer) clearTimeout(this.closetimer);
    },
    handleClick(event) {

        const { disabled, onClick, data, preventClose } = this.props;

        event.preventDefault();

        if (disabled) return;

        var newData = {}
        assign(newData, data, monitor.getItem());

        if (typeof onClick === "function") {
            onClick(event, newData);
        }

        if (preventClose) return;

        monitor.hideMenu();

    },
    handleMouseEnter() {
        if (this.closetimer) clearTimeout(this.closetimer);

        if (this.props.disabled || this.state.visible) return;

        this.opentimer = setTimeout(() => this.setState({visible: true}), this.props.hoverDelay);
    },
    handleMouseLeave() {
        if (this.opentimer) clearTimeout(this.opentimer);

        if (!this.state.visible) return;

        this.closetimer = setTimeout(() => this.setState({visible: false}), this.props.hoverDelay);
    },
    render() {
        let { disabled, children, title } = this.props,
            { visible } = this.state;

        const classes = classnames({
                "react-context-menu-link": true,
                disabled,
                active: visible
            }),
            menuClasses = "react-context-menu-item submenu";

        return (
            <div ref={(c) => (this.item = c)} className={menuClasses} style={menuStyles}
                onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
                <a href="#" className={classes} onClick={this.handleClick}>
                    {title}
                </a>
                <MenuWrapper visible={visible}>
                {children}
                </MenuWrapper>
            </div>
        );
    }
});

export default SubMenu;
