import React, { Component } from 'react';
import axios from 'axios';
import Select from 'react-select'
import CurrencyFormat from 'react-currency-format';

const wealthType =[
    { label: "Asset", value: 'asset' },
    { label: "Liability", value: 'liability' }
];

const baseURL = process.env.baseURL || "http://localhost:5000";

export default class EditWealth extends Component {
    constructor(props) {
        super(props);

        this.onChangeWType = this.onChangeWType.bind(this);
        this.onChangeWName = this.onChangeWName.bind(this);
        this.onChangeWBalance = this.onChangeWBalance.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            wType:  'asset',
            wName: '',
            wBalance: 0,
            wAsset: 0,
            wLiability: 0
        }
    }

    componentDidMount() {
        axios.get(baseURL+'wealths/'+this.props.match.params.id)
            .then(response => {
                    let responseBalance = response.data.wType === 'asset' ? response.data.wAsset : response.data.wLiability

                    this.setState({
                        clientName: response.data.clientName,
                        wType: response.data.wType,
                        wName: response.data.wName,
                        wBalance: responseBalance
                    })
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    onChangeWType(option) {
        this.setState({
            wType: option.value
        })
    }

    onChangeWName(e) {
        this.setState({
            wName: e.target.value
        })
    }

    onChangeWBalance(value) {
        this.setState({
            wBalance: value
        }, () => {this.changeBalanceCallback()})
    }

    changeBalanceCallback() {
        if (this.state.wType === 'asset') {
            this.setState({wAsset: this.state.wBalance})
            this.setState({wLiability: 0})
        } else {
            this.setState({wLiability: this.state.wBalance})
            this.setState({wAsset: 0})
        }
    }

    onSubmit(e) {
        e.preventDefault();
        const wealth = {
            wType: this.state.wType,
            wName: this.state.wName,
            wAsset: this.state.wAsset,
            wLiability: this.state.wLiability,
        }

        console.log(wealth);

        axios.post(baseURL+'wealths/update/' + this.props.match.params.id,wealth)
            .then(res => console.log(res.data));

        window.location ='/';
    }

    render() {
        return (
            <div>
                <h3>Edit Wealth</h3>
                
                <form onSubmit={this.onSubmit}>
                    <label>Type: </label>
                    <Select 
                        options= { wealthType } 
                        onChange={this.onChangeWType}
                        value={this.state.wType === 'asset' ? { label: "Asset", value: 'asset' } : { label: "Liability", value: 'liability' }}
                        />
                    <div className="form-group">
                    <label>Name: </label>
                    <input 
                        type="text" 
                        className="form-control"
                        value={this.state.wName}
                        onChange={this.onChangeWName}
                        />
                    </div>
                    <div className="form-group">
                    <label>Balance: </label>
                    <CurrencyFormat 
                        className="form-control" 
                        thousandSeparator={true} 
                        prefix={'$'} 
                        decimalScale={4} 
                        fixedDecimalScale={true}
                        value={this.state.wBalance} 
                        onValueChange={(values) => {
                            this.onChangeWBalance(values.value)}
                        }
                    />
                    </div>

                    <div className="form-group">
                    <input type="submit" value="Update Wealth" className="btn btn-primary" />
                    </div>
                </form>
                </div>
        )
    }
}