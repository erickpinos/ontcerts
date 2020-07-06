import React from 'react';
import '../App.css';
import { getAccount, getIdentity } from '../utils//ontology';
const axios = require('axios').default;

export default class Test extends React.Component {

		constructor(props) {
			super(props);
		}

		async componentDidMount() {
      const payerAddress = await getAccount();
		}

    async getDDO() {

      const identity = await getIdentity();

      const data = {
        identity
      }

      let res = await axios.post("/identity/getDDO", data);
      const result = res.data;
      console.log('getDDO', result);
      return result;
    }

		async registerOntId() {

      const identity = await getIdentity();

      const data = {
        identity
      }

      let res = await axios.post("/identity/registerOntId");
      const result = res.data;
      console.log('registerOntId', result);
      return result;
    }

    async getAttributes() {

		      const identity = await getIdentity();

		      const data = {
		        identity
		      }

		      let res = await axios.post("/identity/getAttributes", data);
		      const result = res.data;
		      console.log('getAttributes', result);
		      return result;
		    }

    async getDocument() {

      const identity = await getIdentity();

      const data = {
        identity
      }

      let res = await axios.post("/identity/getDocument", data);
      const result = res.data;
      console.log('getDocument', result);
      return result;
    }
    async addAttributes() {

      const identity = await getIdentity();
      const payerAddress = await getAccount();

//      const attributes = {attributes: [{key: 'Student', type: 'String', value: 'No' }]};
      const attributes = [{key: 'Student', type: 'String', value: 'Yes' }];

      const data = {
        identity,
        payerAddress,
        attributes
      }


      let res = await axios.post("/identity/addAttributes", data);
      const result = res.data;
      console.log('addAttributes', result);
      return result;
    }

		async removeAttribute() {
			let res = await axios.post("/identity/removeAttribute");
			const result = res.data;
			console.log('removeAttribute', result);
			return result;
		}

		async regIdWithAttributes() {

			const identity = await getIdentity();
			const payerAddress = await getAccount();

//      const attributes = {attributes: [{key: 'Student', type: 'String', value: 'No' }]};
			const attributes = [{key: 'Student', type: 'String', value: 'No' }];

			const data = {
				attributes
			}


			let res = await axios.post("/identity/regIdWithAttributes", data);
			const result = res.data;
			console.log('regIdWithAttributes', result);
			return result;
		}


		render() {
  		return (
  			<div className="Test">
        <div className="row">
          <div className="col">
            <h3>Test</h3>
						<button onClick={this.registerOntId}>registerOntId</button>
						<button onClick={this.regIdWithAttributes}>regIdWithAttributes</button>
            <button onClick={this.getDDO}>getDDO</button>
            <button onClick={this.getAttributes}>getAttributes</button>
            <button onClick={this.getDocument}>getDocument</button>
            <button onClick={this.addAttributes}>addAttributes</button>
            <button onClick={this.removeAttribute}>removeAttribute</button>
          </div>
        </div>
        </div>
		  );
    }
}
