import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import CurrencyFormat from 'react-currency-format';
import '../css/wealth-list.css';
import Chart from 'chart.js/auto';

const Wealth = props => (
    <tr>
      <td>{props.wealth.wType}</td>
      <td>{props.wealth.wName}</td>
      <td>
        <CurrencyFormat 
            value={props.wealth.wType === 'asset' ? props.wealth.wAsset : props.wealth.wLiability} 
            displayType={'text'} 
            thousandSeparator={true} 
            prefix={'$'} 
            decimalScale={4}
        />
      </td>
      <td>
        <Link to={"/edit/"+props.wealth._id}>edit</Link> | <a href="#" onClick={() => { props.deleteWealth(props.wealth._id) }}>delete</a>
      </td>
    </tr>
  )

const baseURL = "https://mzhassetmanagement.herokuapp.com/" //process.env.baseURL || "http://localhost:5000/";

export default class WealthsList extends Component {


    
    constructor(props) {
        super(props);
        
        this.deleteWealth = this.deleteWealth.bind(this);
        this.createChart = this.createChart.bind(this);

        this.state = {
            assetTotal: 0,
            liabilityTotal: 0,
            netWorth: 0,
            wealths: [],
        };

    }

    calcTotals(){
        axios.get(baseURL+'wealths/sum')
            .then(response => {
                this.setState({
                    assetTotal: response.data.assetTotal,
                    liabilityTotal: response.data.liabilityTotal,
                    netWorth: response.data.netWorth
                },() => {this.createChart()})
            })
    }

    componentDidMount() {
        axios.get(baseURL+'wealths/')
            .then(response => {
                this.setState({ wealths: response.data },() => {this.calcTotals()})
            })
            .catch((error) => {
                console.log(error);
            })
        
            
    }

    deleteWealth(id) {
        axios.delete(baseURL+'wealths/'+id)
            .then(response => console.log(response.data));

        this.setState({
            wealths: this.state.wealths.filter(el => el._id !== id)
        })
        //},() => {this.updateChart()})
    }

    wealthList() {
        return this.state.wealths.map(currentwealth => {
            return <Wealth wealth={currentwealth} deleteWealth={this.deleteWealth} key={currentwealth._id}/>;
        })
    }

    // updateChart() {
    //     Chart.instances[1].update();
    //     console.log(Chart.instances);
    // }

    // Chart documentation:
    // https://www.chartjs.org/docs/latest/charts/bar.html
    createChart() {
        var ctx = document.getElementById('wealthChart');
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Assets', 'Liabilities'],
                datasets: [{
                    label: 'Portfolio',
                    data: [this.state.assetTotal, this.state.liabilityTotal],
                    backgroundColor: [
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(255, 99, 132, 0.2)'
                    ],
                    borderColor: [
                        'rgba(75, 192, 192, 1)',
                        'rgba(255, 99, 132, 1)'
                    ],
                    borderWidth: 1
                }],
            },
            options: {
                indexAxis: 'y',
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        })
    }

    render() {
        return (
            <div>
                <h3>Wealth List</h3>
                <div className="row">
                    <div className="column">
                        <dl>
                            <dt>
                                <label>Assets Total:</label>
                            </dt>
                            <dd>
                                <CurrencyFormat 
                                    value={this.state.assetTotal} 
                                    displayType={'text'} 
                                    thousandSeparator={true} 
                                    prefix={'$'} 
                                    decimalScale={4}
                                />
                            </dd>
                            <dt>
                                <label>Liabilities Total:</label>
                            </dt>
                            <dd>
                                <CurrencyFormat 
                                    value={this.state.liabilityTotal} 
                                    displayType={'text'} 
                                    thousandSeparator={true} 
                                    prefix={'$'} 
                                    decimalScale={4}
                                />
                            </dd>
                            <dt>
                                <label>Net Worth:</label>
                            </dt>
                            <dd>
                                <CurrencyFormat 
                                    value={this.state.netWorth} 
                                    displayType={'text'} 
                                    thousandSeparator={true} 
                                    prefix={'$'} 
                                    decimalScale={4} 
                                />
                            </dd>
                        </dl>
                    </div>
                    <div className="column">
                        <canvas id="wealthChart" width="400" height="120"></canvas>
                    </div>
                </div>
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