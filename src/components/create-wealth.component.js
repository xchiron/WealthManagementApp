import React, { Component } from 'react';
import axios from 'axios';
import Select from 'react-select'

const wealthType =[
    { label: "Asset", value: 'asset' },
    { label: "Liability", value: 'liability' }
];

export default class CreateWealth extends Component {
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

    onChangeWBalance(e) {
        this.setState({
            wBalance: e.target.value
        })

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

        axios.post("http://localhost:5000/wealths/add",wealth)
            .then(res => console.log(res.data));

        window.location ='/';   
    }

    render() {
        return (
            <div>
      <h3>Create New Wealth Log</h3>
      
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
          <input 
              type="text" 
              className="form-control"
              value={this.state.wBalance}
              onChange={this.onChangeWBalance}
              />
        </div>

        <div className="form-group">
          <input type="submit" value="Create Wealth Log" className="btn btn-primary" />
        </div>
      </form>
    </div>
        )
    }
}