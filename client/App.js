import React, {Component} from 'react';
import { HTMLSelect, InputGroup, ControlGroup, FormGroup, Navbar, Alignment, Button } from '@blueprintjs/core';
import { AtSign, Send } from 'react-feather';

class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      thunders: [
        'Thunder with six packs',
        'Thunder with pot belly',
        'Thunder with gym subscription',
        'Thunder with anger issues',
        'Thunder doing press up',
        'Thunder from Mushin',
      ]
    }
  }

  handleSubmit(event){
    event.preventDefault();
    const data = new FormData(event.target);
    let formData = {thunder: data.get('thunder')};
    console.log(formData);
    
    fetch('http://localhost:3000/orders', {method: 'POST', body: {thunder:'test'}, mode: 'no-cors'}).then(order => console.log(order)
    );
  }

  render(){
    return (<div style={{ width:'60%', textAlign: 'center', margin: '0 auto' }}>

    <h2>Send Thunder</h2>
  
    <form onSubmit={this.handleSubmit.bind(this)} method="POST">

    <FormGroup label="Select Thunder">

      <HTMLSelect large fill name="thunder" options={this.state.thunders}>
        
      </HTMLSelect>
    </FormGroup>

  <FormGroup label="Recepient's Twitter"
      >
    <ControlGroup fill={true} vertical={false}>
        <Button style={{ maxWidth: '50px'  }}><AtSign/></Button>
        <InputGroup placeholder="umestanley" name="recipient" large/>
    </ControlGroup>
  </FormGroup>
      
      <br/>
{/* 
        <span icon="Camera" class="bp3-icon" style={{ fontSize: '28px', margin: '0 5px', fontWeight: 'bold' }}>@</span>
      <InputGroup placeholder="umestanley" large /> */}

      <Button intent="success" large type="submit">Send</Button>

    </form>
  
  </div>);
  }
}

export default App;