import React, { Component } from 'react';
import axios from 'axios';

export default class EditWealth extends Component {
    constructor(props) {
        super(props);

        this.onChangeClientName = this.onChangeClientName.bind(this);
        this.onChangeWType = this.onChangeWType.bind(this);
        this.onChangeWName = this.onChangeWName.bind(this);
        this.onChangeWBalance = this.onChangeWBalance.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            clientName: '',
            wType: '',
            wName: '',
            wBalance: 0,
            clients: []
        }
    }

    componentDidMount() {
        axios.get('http://localhost:5000/wealths/'+this.props.match.params.id)
            .then(response => {
                    this.setState({
                        clientName: response.data.clientName,
                        wType: response.data.wType,
                        wName: response.data.wName,
                        wBalance: response.data.wBalance
                    })
            })
            .catch(function (error) {
                console.log(error);
            })
        
        axios.get('http://localhost:5000/clients/')
            .then(response => {
                if (response.data.length > 0) {
                    this.setState({
                        clients: response.data.map(client => client.clientName),
                    })
                }
            })
            .catch((error) => {
                console.log(error);
            })
    }

    onChangeClientName(e) {
        this.setState({
            clientName: e.target.value
        })
    }

    onChangeWType(e) {
        this.setState({
            wType: e.target.value
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
    }

    onSubmit(e) {
        e.preventDefault();

        const wealth = {
            clientName: this.state.clientName,
            wType: this.state.wType,
            wName: this.state.wName,
            wBalance: this.state.wBalance,
        }

        console.log(wealth);

        axios.post('http://localhost:5000/wealths/update/' + this.props.match.params.id,wealth)
            .then(res => console.log(res.data));

        window.location ='/';
    }

    render() {
        return (
            <div>
                <h3>Edit Wealth </h3>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group"> 
                    <label>Client's Name: </label>
                    <select ref="userInput"
                        required
                        className="form-control"
                        value={this.state.clientName}
                        onChange={this.onChangeClientName}>
                        {
                            this.state.clients.map(function(client) {
                                return <option 
                                    key={client}
                                    value={client}>{client}
                                    </option>;
                            })
                        }
                    </select>
                    </div>
                    <div className="form-group"> 
                    <label>Type: </label>
                    <input  type="text"
                        required
                        className="form-control"
                        value={this.state.wType}
                        onChange={this.onChangeWType}
                        />
                    </div>
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
                    <input type="submit" value="Edit Wealth Log" className="btn btn-primary" />
                    </div>
                </form>
                </div>
        )
    }
}