import React, {Component} from 'react';
import {ReverseLink} from '../utils.js';
import Icon from './icons.js';
import {RadioCheckInput} from './forms.js';


function TableHead(props) {
    let checkboxTh = (
            <th className="checkbox-col">
                <RadioCheckInput 
                    type="checkbox"
                    checked={props.checked} 
                    onChange={props.onCheckChange} 
                    disabled={!props.isCheckable} 
                />
            </th>);

    let thWidths = props.thWidths || [];

    return (
        <thead>
            <tr>
                {checkboxTh}
                {props.th.map((th, index) => {
                    let width = thWidths[index];
                    let thCls = width ? 'thcol-' + width : null;
                    return <th key={th} className={thCls}>{th}</th>;
                    })
                }
                {props.hasActions ? 
                    <th key={'actions'} className={thWidths.length > props.th.length && 'thcol-' + thWidths[props.th.length]}>Actions</th> 
                    : null
                }
            </tr>
        </thead>
    );
}


function TableRow (props) {
    let checkboxTd = (
            <td className="checkbox-col">
                <RadioCheckInput
                    type="checkbox" 
                    checked={props.checked} 
                    onChange={props.onCheckChange} 
                    disabled={!props.isCheckable}
                />
            </td>);

    return (
        <tr className={props.flash ? "flash" : null}>
            {checkboxTd}
            {props.children}
        </tr>
    );
}


export default class Table extends Component {
    constructor(props) {
        super(props);

        this.state = {
            headChecked: false,
            rowsChecked: []
        }

        this.handleHeadCheck = this.handleHeadCheck.bind(this);
        this.handleRowCheck = this.handleRowCheck.bind(this);
    }

    handleHeadCheck(e) {
        let checkedIds = [];
        if (e.target.checked === true) {
            checkedIds = this.props.data.map((item) => item.id);
        }
        this.props.tableCheckCallback(checkedIds);

        this.setState({headChecked: e.target.checked, rowsChecked: []});

    }

    handleRowCheck(e, id) {
        let rowsChecked = this.state.rowsChecked;

        if (e.target.checked) {
            rowsChecked.push(id);
            this.setState({rowsChecked: rowsChecked});
        }
        else {
            let rowIndex = rowsChecked.indexOf(id);
            if (rowIndex > -1) {
                rowsChecked.splice(rowIndex, 1);
                this.setState({rowsChecked: rowsChecked});
            } else if (this.state.headChecked) {
                for (let i = 0; i < this.props.data.length; i++) {
                    let _id = this.props.data[i].id;
                    if (_id !== id)
                        rowsChecked.push(_id)
                }

                this.setState({rowsChecked: rowsChecked, headChecked: false});
            }
        }


        this.props.tableCheckCallback(rowsChecked);
    }

    getTableRowURI = () => {
        let queryString = window.location.search;

        if (queryString.length)
            return this.props.tableRowURI + '?_list_filters=' + encodeURIComponent(queryString);

        return this.props.tableRowURI;
    }

    renderForMobile = () => {

        let hasActions = this.props.tableRowActions ? true : false;
        let colCls = this.props.tableColCls || [];

        let cards = this.props.data.map((row) => {

            let cols = [];

            for (let j = 0; j < this.props.tableCols.length; j++) {

                let colKey = 'col_' + j + '_' + row.id;

                let label = this.props.tableTh[j];

                let val = row[this.props.tableCols[j]];

                if (typeof val === 'boolean') {
                    val = val ? <Icon name="check-circle" className="table-col-icon text-success" /> : <Icon name="x-circle" className="table-col-icon text-error" />;
                }

                let colClass = colCls[j];

                if (!colClass) {
                    if (j === 0)
                        colClass = 'col-12';
                    else 
                        colClass = 'col-6';
                }

                cols.push(
                    <div key={colKey} className={colClass}>
                        <span className="col-label">{label}</span>
                        <span className={j === 0 ? "item-title" : ""}>{val}</span>
                    </div>
                );

            }

            let actionsCol = null;
            if (hasActions)
                actionsCol = <div className="col-12 actions-col">{this.props.tableRowActions(row)}</div>;

            if (this.props.tableRowURI) {
                return (
                    <div key={row.id}>
                        <ReverseLink 
                            to={this.getTableRowURI()} 
                            args={{id: row.id}}
                            className="table-item-card"
                        >
                            <div className="row">{cols}</div>
                            <div className="caret"><Icon name="chevron-right" /></div>
                        </ReverseLink>
                    </div>
                );
            } else {
                return (
                    <div key={row.id}>
                        <div className="table-item-card">
                            <div className="row">{cols}{actionsCol}</div>
                        </div>
                    </div>
                );
            }
        });

        return (
            <div>
                {cards}
            </div>
        );
    }

    render() {
        const isMobile = window.innerWidth < 576;

        if (this.props.data.length < 1) {
            return (
                <div className="well">
                    <h1>Nothing here</h1>
                </div>
            );
        }

        if (isMobile)
            return this.renderForMobile();

        let head;
        let hasActions = this.props.tableRowActions ? true : false;
        let isCheckable = this.props.tableCheckable ? true : false;
        if (this.props.tableTh)
            head = <TableHead 
                        th={this.props.tableTh} 
                        checked={this.state.headChecked}
                        onCheckChange={this.handleHeadCheck} 
                        hasActions={hasActions}
                        isCheckable={isCheckable}
                        thWidths={this.props.tableThWidths}
                    />

        let flashRows = this.props.flashRows || [];
        let rows = [];

        for (let i = 0; i < this.props.data.length; i++) {

            let row = this.props.data[i];

            let cols = [];

            for (let j = 0; j < this.props.tableCols.length; j++) {

                let colKey = 'col_' + j + '_' + row.id;

                if (this.props.tableRowURI && j === 0)
                    cols.push(
                        <td key={colKey}>
                            <ReverseLink to={this.getTableRowURI()} args={{id: row.id}}>{row[this.props.tableCols[j]]}</ReverseLink>
                        </td>
                    );
                else {
                    let val = row[this.props.tableCols[j]];
                    
                    if (typeof val === 'boolean') {
                        val = val ? <Icon name="check-circle" className="table-col-icon text-success" /> : <Icon name="x-circle" className="table-col-icon text-error" />;
                    } 

                    cols.push(<td key={colKey}>{val}</td>);
                }

            }

            let actionsTd = null;
            if (hasActions)
                actionsTd = <td>{this.props.tableRowActions(row)}</td>;

            rows.push(
                <TableRow 
                    key={row.id} 
                    checked={this.state.headChecked || this.state.rowsChecked.indexOf(row.id) > -1} 
                    onCheckChange={(e) => this.handleRowCheck(e, row.id)}
                    isCheckable={isCheckable}
                    flash={flashRows.includes(i)}
                >
                    {cols}
                    {actionsTd}
                </TableRow>);
        }

        return (
            <table>
                {head}
                <tbody>
                    {rows}
                </tbody>
            </table>
        );
    }
}