import React, {Component} from 'react';
import { Toaster, Icon } from '@blueprintjs/core';
// import { AtSign, Send, XCircle } from 'react-feather';
// import { serverUrl } from './config';

class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      thunders: [
        // 'Thunder with six packs',
        // 'Thunder with pot belly',
        // 'Thunder with gym subscription',
        // 'Thunder with anger issues',
        // 'Thunder doing press up',
        // 'Thunder from Mushin',
        // 'Thunder with Infinity gauntlet',
        // 'Thunder with mental problems',
        // 'Thunder wey smoke weed',
        // 'Thunder that took John Wick's crash course',
        // 'Thunder that works remotely',
        // 'Thunder with black belt'
      ],
      orders: []
    }

  }

  componentDidMount(){
      // Get Orders
      fetch('/api/orders', { headers: {'Content-Type':'application/json'} }).then(res => res.json()).then(orders => this.setState({orders: orders})).catch(e => console.log(e));
      // Get Thunders
      fetch('/api/thunders').then(response => response.json()).then(thunders => this.setState({thunders: thunders})).catch(e => console.log(e));
  }

  handleSubmit(event){
    event.preventDefault();
    const data = new FormData(event.target);
    let formData = {thunder_name: data.get('thunder'), recipient: data.get('recipient')};
    // console.log(formData);
    
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
          this.setState({orders: [order, ...this.state.orders]})
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
  
      {/* <FormGroup label="Select Thunder">
        <HTMLSelect large fill name="thunder" options={this.state.thunders.map(a=>(a.name))}>
          
        </HTMLSelect>
      </FormGroup>

      <FormGroup label="Recepient's Twitter">
        <ControlGroup fill={true} vertical={false}>
            <Button style={{ maxWidth: '50px'  }}><AtSign/></Button>
            <InputGroup placeholder="umestanley" name="recipient" large/>
        </ControlGroup>
      </FormGroup>

      <br/>

      <Button intent="success" large type="submit">Fire</Button> */}

    <form onSubmit={this.handleSubmit.bind(this)} method="POST">

      <select name="thunder" style={{ marginBottom: '15px', marginTop: '25px' }}>
        { this.state.thunders.map((thunder, i) => <option value={thunder.name} key={i}>{thunder.name}</option>) }
      </select>

      <div style={{ display: 'flex' }}>
        <input value="@" readOnly style={{ width:'10%', minWidth: '50px', textAlign: 'center', borderRadius: '7px 0 0 7px', borderRight: 'none' }}/>
        <input name="recipient" placeholder="Twitter handle" autoComplete="off" style={{ borderRadius: '0 7px 7px 0' }}/>
      </div>

      
      <br/>

      <button type="submit" className="submit-btn">⚡ Fire</button>

    </form>

    
    {/* <h2 style={{ marginTop: '50px', color: '#DEF' }}>That's enough fun for today. ⚡</h2> */}

    <br/>
    
    {/* <form onSubmit={this.createThunder.bind(this)}>
      <InputGroup placeholder="Thunder title" name="name" large required/>
      <Button intent="success" large type="submit">Save</Button>
    </form> */}

    <table>
      <thead>
        <tr>
          <th width="50%">Thunder</th>
          <th>Recipient</th>
        </tr>
      </thead>
      <tbody>
        {this.state.orders.map((order, index) => { return <tr key={index}><td>{order.thunder_name}</td><td><a href={'https://twitter.com/'+order.recipient.replace('@', '')} target="_blank">{order.recipient}</a></td></tr>})}
      </tbody>
    </table>

    <div>Check Tweets & Replies of <a href="https://twitter.com/sendthunder" target="_blank"><u>@sendthunder</u></a></div>

    <div className="footer">&copy; All Rice Re-Served 🍚</div>
  
  </div>);
  }
}

export default App;