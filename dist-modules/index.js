'use strict';

var React = require('react');

var segmentize = require('./segmentize');

var Paginator = React.createClass({
    displayName: 'Paginator',

    propTypes: {
        onSelect: React.PropTypes.func,
        page: React.PropTypes.number,
        beginPages: React.PropTypes.number,
        endPages: React.PropTypes.number,
        showPrevNext: React.PropTypes.bool,
        className: React.PropTypes.string,
        ellipsesClassName: React.PropTypes.string,
        prevClassName: React.PropTypes.string,
        nextClassName: React.PropTypes.string,
        prevButton: React.PropTypes.node,
        nextButton: React.PropTypes.node
    },
    getDefaultProps: function getDefaultProps() {
        return {
            onSelect: noop,
            showPrevNext: false,
            className: 'pagify-pagination',
            ellipsesClassName: '',
            prevClassName: 'pagify-prev',
            nextClassName: 'pagify-next'
        };
    },
    render: function render() {
        var _this = this;

        var _props = this.props;
        var onSelect = _props.onSelect;
        var page = _props.page;
        var ellipsesClassName = _props.ellipsesClassName;
        var className = _props.className;
        var showPrevNext = _props.showPrevNext;
        var prevClassName = _props.prevClassName;
        var nextClassName = _props.nextClassName;

        var segments = segmentize(this.props);
        segments = segments.reduce(function (a, b) {
            return a.concat(-1).concat(b);
        });

        var items = segments.map(function (num, i) {
            if (num >= 0) {
                return React.createElement(
                    'li',
                    {
                        key: 'pagination-' + i,
                        onClick: onSelect.bind(null, num),
                        className: num === page && 'selected'
                    },
                    React.createElement(
                        'a',
                        { href: '#', onClick: _this.preventDefault },
                        num + 1
                    )
                );
            }

            return React.createElement(
                'li',
                {
                    key: 'pagination-' + i,
                    className: ellipsesClassName
                },
                '…'
            );
        });

        var prevButton = React.createElement(
            'li',
            {
                onClick: onSelect.bind(null, page - 1),
                className: prevClassName
            },
            React.createElement(
                'a',
                { href: '#', onClick: this.preventDefault },
                this.props.prevButton ? this.props.prevButton : 'Previous'
            )
        );

        var isFirstPage = page === 0;
        var isLastPage = page === segments[segments.length - 1];

        var nextButton = React.createElement(
            'li',
            {
                onClick: onSelect.bind(null, page + 1),
                className: nextClassName
            },
            React.createElement(
                'a',
                { href: '#', onClick: this.preventDefault },
                this.props.nextButton ? this.props.nextButton : 'Next'
            )
        );

        return React.createElement(
            'ul',
            { className: className },
            showPrevNext && !isFirstPage && prevButton,
            items,
            showPrevNext && !isLastPage && nextButton
        );
    },

    preventDefault: function preventDefault(e) {
        e.preventDefault();
    }
});

function paginate(data, o) {
    data = data || [];

    var page = o.page || 0;
    var perPage = o.perPage;

    var amountOfPages = Math.ceil(data.length / perPage);
    var startPage = page < amountOfPages ? page : 0;

    return {
        amount: amountOfPages,
        data: data.slice(startPage * perPage, startPage * perPage + perPage),
        page: startPage
    };
}

function noop() {}

Paginator.paginate = paginate;

module.exports = Paginator;