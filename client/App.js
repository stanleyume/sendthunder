import React, {Component} from 'react';
import { Toaster, Icon } from '@blueprintjs/core';
import { GitHub } from 'react-feather';
// import { serverUrl } from './config';

class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      thunders: [
        "Thunder with six-pack",
        "Thunder doing press-up",
        "Thunder with pot belly",
        "Thunder with gym subscription",
        "Thunder with anger issues",
        "Thunder from Mushin",
        "Thunder with Infinity Gauntlet",
        "Thunder with mental problems",
        "Thunder wey smoke Oshogbo weed",
        "Thunder with black belt",
        "Thunder that works remotely",
        "Thunder that took John Wick's crash course",
        "Thunder that did internship with Sango",
        "Thunder in an infinite loop",
        "Soft Thunder",
        "Muri Thunder",
        "Thunder with Masters degree from Harvard",
        "Thunder with megaphone",
        "Thunder with PhD in Electrical Engineering"
      ],
      orders: [],
      orders_today: 0,
      orders_all: 0
    }

  }

  componentDidMount(){
      // Get Orders
      fetch('/api/orders', { headers: {'Content-Type':'application/json'} }).then(res => res.json()).then(orders => this.setState({orders: orders})).catch(e => console.log(e));

      // Get Thunders
      // fetch('/api/thunders').then(response => response.json()).then(thunders => this.setState({thunders: thunders})).catch(e => console.log(e));

      // Get Orders Today
      fetch('/api/orders/count').then(response => response.json()).then(counts => { this.setState({orders_today: counts.countToday, orders_all: counts.countAll}) }).catch(e => console.log(e));
      console.log(this.state);
  }

  handleSubmit(event){
    event.preventDefault();
    const data = new FormData(event.target);
    let formData = {thunder_name: data.get('thunder'), recipient: data.get('recipient'), thunders: this.state.thunders};
    
    fetch('/api/orders', {method: 'POST', body: JSON.stringify(formData), headers: {"Content-Type":"application/json"}}).then(res => {
        if(!res.ok){
          Toaster.create({position: "top"}).show({message: res.statusText, intent: "danger", icon: <Icon icon="error"/>});
          throw Error(res.statusText);
        } else {
          Toaster.create({position: "top"}).show({message: res.statusText + " 🚚📦", intent: "success", icon: <Icon icon="tick-circle"/>});
          return res.json();
        }
      }).then(order => {
          document.getElementsByName('recipient')[0].value = '';
          this.setState({orders: [order, ...this.state.orders], orders_today: this.state.orders_today + 1, orders_all: this.state.orders_all + 1 })
        } ).catch(e => console.log(e));
  }

  createThunder(event){
    event.preventDefault();
    let data = new FormData(event.target);
    let formData = {name: data.get('name')};

    fetch('/api/thunders', {method: 'POST', body: JSON.stringify(formData), headers: {'Content-Type':'application/json'}}).then(res => res.json()).then(thunder => { this.setState({ thunders: [...this.state.thunders, thunder] }); }).catch(e => console.log(e));
  }

  render(){  

    return (<div>

    <h1 className="title">Send Thunder</h1>
    <h3 className="sub-title">Anonymously send thunder to anyone via Twitter</h3>


    <form onSubmit={this.handleSubmit.bind(this)} method="POST">

      <select name="thunder" style={{ marginBottom: '15px', marginTop: '25px' }}>
        { this.state.thunders.map((thunder, i) => <option value={thunder} key={i}>{thunder}</option>) }
      </select>

      <div style={{ display: 'flex' }}>
        <input value="@" readOnly style={{ width:'10%', minWidth: '50px', textAlign: 'center', borderRadius: '7px 0 0 7px', borderRight: 'none' }}/>
        <input name="recipient" placeholder="Twitter handle" autoComplete="off" style={{ borderRadius: '0 7px 7px 0' }}/>
      </div>

      
      <br/>

      <button type="submit" className="submit-btn">⚡ Fire</button>

    </form>

    
    {/* <div style={{ marginTop: '30px', color:'#DDD', fontSize:'30px' }}>{ this.state.orders_all } orders processed</div> */}

    <table>
      <thead>
        <tr>
          <th width="50%">Thunder</th>
          <th>Recipient</th>
          <th>Tracking No.</th>
        </tr>
      </thead>
      <tbody>
        {this.state.orders.map((order, index) => { return <tr key={index}><td>{order.thunder_name}</td><td><a href={'https://twitter.com/'+order.recipient.replace('@', '')} target="_blank">{order.recipient}</a></td><td>{order.meta.id.slice(0,8).toUpperCase()}</td></tr>})}
      </tbody>
    </table>

    <div>Check Tweets & Replies of <a href="https://twitter.com/sendthunder" target="_blank"><u>@sendthunder</u></a></div>


    <div style={{ marginTop: '20px' }}> <a href="https://github.com/stanleyume/sendthunder"><Icon icon="git-repo" iconSize={16}/> <div style={{ fontSize: '15px', display: 'inline-block', verticalAlign:'middle', marginLeft:'5px' }}> Github</div></a></div>


    <div className="footer">&copy; { new Date().getFullYear() }. All Rice Re-Served 🍚</div>
    <div style={{ marginTop: '10px' }}>{ this.state.orders_today }</div>
  
  </div>);
  }
}

export default App;