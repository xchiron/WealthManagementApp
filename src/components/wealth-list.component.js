import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Wealth = props => (
    <tr>
      <td>{props.wealth.wType}</td>
      <td>{props.wealth.wName}</td>
      <td>{props.wealth.wType === 'asset' ? props.wealth.wAsset : props.wealth.wLiability}</td>
      <td>
        <Link to={"/edit/"+props.wealth._id}>edit</Link> | <a href="#" onClick={() => { props.deleteWealth(props.wealth._id) }}>delete</a>
      </td>
    </tr>
  )

export default class WealthsList extends Component {
    constructor(props) {
        super(props);
        
        this.deleteWealth = this.deleteWealth.bind(this);

        this.state = {
            assetTotal: 0,
            liabilityTotal: 0,
            netWorth: 0,
            wealths: []
        };

    }

    calcTotals(){
        this.setState({ assetTotal: this.state.wealths.map(wealth => wealth.wAsset).reduce((acc, wealth) => wealth + acc) }, () => {this.calcNetWorth()})
        this.setState({ liabilityTotal: this.state.wealths.map(wealth => wealth.wLiability).reduce((acc, wealth) => wealth + acc) }, () => {this.calcNetWorth()})
    }

    calcNetWorth() {
        this.setState({ netWorth: this.state.assetTotal - this.state.liabilityTotal})

    }

    componentDidMount() {
        axios.get('http://localhost:5000/wealths/')
            .then(response => {
                this.setState({ wealths: response.data },() => {this.calcTotals()})
            })
            .catch((error) => {
                console.log(error);
            })
    }

    deleteWealth(id) {
        axios.delete('http://localhost:5000/wealths/'+id)
            .then(response => console.log(response.data));

        this.setState({
            wealths: this.state.wealths.filter(el => el._id !== id)
        })
    }

    wealthList() {
        return this.state.wealths.map(currentwealth => {
            return <Wealth wealth={currentwealth} deleteWealth={this.deleteWealth} key={currentwealth._id}/>;
        })
    }

    render() {
        return (
            <div>
                <h3>Wealth List</h3>
                <p>Assets Total: {this.state.assetTotal}</p>
                <p>Liabilities Total: {this.state.liabilityTotal}</p>
                <p>Net Worth: {this.state.netWorth}</p>
                <table className="table">
                <thead className="thead-light">
                    <tr>
                    <th>Type</th>
                    <th>Name</th>
                    <th>Balance</th>
                    <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    { this.wealthList() }
                </tbody>
                </table>
            </div>
        )
    }
}