// /client/App.js
import React, { Component } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Brush, ResponsiveContainer } from 'recharts';
import { Button, Header, Icon, Modal, Input } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

class App extends Component {
  // initialize our state
  state = {
    data: [],
    filteredData: [],
    startDate: "2018-01-01",
    endDate: "2019-02-28",
    error: false
  };

  // when component mounts, first thing it does is fetch all existing data in our db
  // then we incorporate a polling logic so that we can easily see if our db has
  // changed and implement those changes into our UI
  componentDidMount() {
    this.getDataFromDb();
  }

  // never let a process live forever
  // always kill a process everytime we are done using it
  componentWillUnmount() {

  }

  // just a note, here, in the front end, we use the id key of our data object
  // in order to identify which we want to Update or delete.
  // for our back end, we use the object id assigned by MongoDB to modify
  // data base entries

  // our first get method that uses our backend api to
  // fetch data from our data base


  handleChangeStart = (event) => {
    this.setState({
      startDate: event.target.value
    });
  }

  handleChangeEnd = (event) => {
    this.setState({
      endDate: event.target.value
    });
  }


  filterData = () => {
    var sDate = new Date(this.state.startDate)
    var eDate = new Date(this.state.endDate)
    if(!isNaN(sDate.getTime())&&!isNaN(eDate.getTime())&&sDate<eDate){
      var fData = this.state.data;
      fData = fData.filter(item => new Date(item.date) >= sDate && new Date(item.date) <= eDate);
      this.setState({filteredData: fData, error: false})
    }
    else {
      this.setState({error: true})
    }
  }

  getDataFromDb = () => {
    fetch("/api/getData")
      .then(data => data.json()).then(res => {
        res.data.map(item => {
          item.close = Math.round(parseFloat(item.close));
          var date = new Date(item.date);
          item.date = date.getMonth()+1+"/"+date.getDate()+"/"+(date.getYear()-100)+"";
        });
        this.setState({ filteredData: res.data, data: res.data });
      });
      //.then(res => this.setState({ data: res.data }));
  };

  // here is our UI
  // it is easy to understand their functions when you
  // see them render into our screen
  render() {
    const { filteredData } = this.state;
    return (
      <div>

        <div style={{display: 'flex', flexDirection: 'row', justifyContent:'space-between'}}>
          <h1 style={{fontWeight: 'lighter', marginTop: '2%', marginLeft: '5%', textAlign: 'center'}}>wsbInverse<sub style={{fontSize: 'x-small'}}> beta</sub></h1>

          <div style={{display: 'flex', flexDirection: 'row-reverse', marginTop:'2%', marginBottom: '1%'}}>

            <Modal trigger={<Button basic color='black' style={{marginRight:15, marginBottom: 5}}>feedback</Button>} basic size='small' centered={true}>
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <h1>Feedback</h1>
                <Modal.Content>
                  <p style={{textAlign: 'left'}}>
                    You can email me at wsbinverse@gmail.com for any questions/suggestions. Please reach out to me if you enjoy data engineering and would like to contribute.
                  </p>
                </Modal.Content>
              </div>
            </Modal>


            <Modal trigger={<Button basic color='black' style={{marginRight:5, marginBottom: 5}}>upcoming</Button>} basic size='small' centered={true}>
                        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                          <h1>Upcoming Features</h1>
                          <Modal.Content>
                          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                            <ul>
                              <li style={{textAlign: 'left'}}>
                                Ability to search for a particular stock symbol and generate word frequency/sentiment graphs for it
                              </li>
                              <li style={{textAlign: 'left'}}>
                                Addition of historical data before 2018 to the central dataset
                              </li>
                              <li style={{textAlign: 'left'}}>
                                Automated addition of daily data to the central dataset
                              </li>
                              <li style={{textAlign: 'left'}}>
                                Outline of details on which key words/phrases had the greatest impact on the sentiment score
                              </li>
                              <li style={{textAlign: 'left'}}>
                                Improvement of UI with the addition of more basic features
                              </li>
                              <li style={{textAlign: 'left'}}>
                                Improvement to the Spark execution job
                              </li>
                            </ul>
                          </div>
                          </Modal.Content>
                        </div>
            </Modal>

            <Modal trigger={<Button basic color='black' style={{marginRight:5, marginBottom: 5}}>usage</Button>} basic size='small' centered={true}>
                                  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                    <h1>Usage</h1>
                                    <Modal.Content>
                                      <p style={{textAlign: 'left'}}>
                                        The first graph is a simple representation of spx closing price as a function of date. The second graph is a slightly more complex representation of wsb sentiment, based on word frequency checks, as a function of date. This "score" is nothing but [number of positive sentiment occurences - number of negative sentiment occurences]
                                      </p>
                                      <p style={{textAlign: 'left'}}>
                                        The dates along the x axis are aligned so you can compare how wsb sentiment changed as the actual price of SPX changed with time. Enter values for the date range which you are interested in and use the slider for fine-tuning.                                      </p>
                                    </Modal.Content>
                                  </div>
            </Modal>


            <Modal trigger={<Button basic color='black' style={{marginRight:5, marginBottom: 5}}>about</Button>} basic size='small' centered={true}>
                                            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                              <h1>About wsbInverse</h1>
                                              <Modal.Content>
                                                <p style={{textAlign: 'left'}}>
                                                  We have all heard the phrase, "feel the market". So how good is the average person at this? When market closing price data is combined with a large amount of data from various websites, we can get some insight into this. Right now, around 90% of the data is coming from WSB, hence the name.
                                                </p>
                                                <p style={{textAlign: 'left'}}>
                                                  Currently, the UI only provides information on general sentiment trends with changes in the SPX closing price. Although the backend suite contains the same type of social data for individual stocks, designing and creating a UI for the selection and portrayal is still pending.
                                                </p>
                                                <p style={{textAlign: 'left'}}>
                                                  The backend consists of a hadoop/spark cluster processing big data from multiple websites and their comment/post APIs. The spark jobs use this data and apply word frequency checks on top of them to generate a second layer of data. Finally, this data is combined with market data and uploaded to a transactional DB which is used to serve this website.
                                                </p>
                                              </Modal.Content>
                                            </div>
            </Modal>


          </div>
        </div>
        <ResponsiveContainer width="99%" height={285}>
            <LineChart
                //width={500}
                //height={250}
                data={filteredData}
                syncId="anyId"
                margin={{
                  top: 0, right: 0, left: 0, bottom: 0,
                }}
              >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{fontSize: 10}}/>
                  <YAxis domain={['dataMin - 50', 'dataMax + 50']} tick={{fontSize: 10}}/>
                  <Tooltip />
                  <Legend verticalAlign="top" align="right" height={25}/>
                  <Line name="spx price" type="monotone" dataKey="close" stroke="#8884d8" fill="#8884d8" dot={false}/>
            </LineChart>
        </ResponsiveContainer>
        <ResponsiveContainer width="99%" height={285}>
            <LineChart
                //width={500}
                //height={250}
                data={filteredData}
                syncId="anyId"
                margin={{
                  top: 0, right: 0, left: 0, bottom: 0,
                }}
              >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{fontSize: 10}}/>
                  <YAxis domain={['dataMin - 50', 'dataMax + 50']} tick={{fontSize: 10}}/>
                  <Tooltip />
                  <Legend verticalAlign="top" align="right" height={25}/>
                  <Line name="sentiment score" type="monotone" dataKey="score" stroke="#82ca9d" fill="#82ca9d" dot={false}/>
                  {this.state.data.length > 0 && <Brush dataKey="date"/>}
            </LineChart>
        </ResponsiveContainer>

        <div style={{display: 'flex', justifyContent: 'center', flexDirection: 'row', marginTop: 10}}>
          <Input type="text" value={this.state.startDate} onChange={this.handleChangeStart} style={{marginRight: 5}} />
          <Input type="text" value={this.state.endDate} onChange={this.handleChangeEnd} style={{marginLeft: 5}}/>
        </div>

        <div style={{display: 'flex', justifyContent: 'center', flexDirection: 'row', marginTop: 10}}>
        <Button basic color = 'black' onClick={this.filterData}>
          filter
        </Button>
        </div>

      </div>
    );
  }
}

export default App;
