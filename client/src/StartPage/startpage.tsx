import { DatePicker } from 'rsuite';
import { useState, useEffect } from 'react';
import SearchConponent from './ResultComponent';
import { TicketType } from './Enums/ticket-type.enum';
import 'rsuite/dist/rsuite.min.css';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useNavigate } from 'react-router-dom';

function StartPage() {
  let objArray: object[] = [];
  const [returnTrip, setReturnTrip] = useState(false);
  const [requestData, setRequestData] = useState({});
  const [tripData, setTripData] = useState(objArray);
  const [adultNum, setAdultNum] = useState(1);
  const [studentNum, setStudentNum] = useState(0);
  const [pensionerNum, setPensionerNum] = useState(0);
  const [kidsNum, setKidsNum] = useState(0);
  const [hide, setHide] = useState(false);
  const [stations, setStations] = useState(['']);
  const API_URL =
    process.env.NODE_ENV === 'production'
      ? 'https://train-booking-function-app.azurewebsites.net/api'
      : (process.env.REACT_APP_API_URL as string);
  useEffect(() => {
    fetchAvailableStations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    ToggleSearchContainer();
  }, [tripData]);

  function submitForm(event: any) {
    event.preventDefault();
    //event.target[8].value för att få värdet om det är återresa eller inte

    const adultTicketAmount = parseInt(event.target[11].value);
    const studentTicketAmount = parseInt(event.target[12].value);
    const pensionerTicketAmount = parseInt(event.target[13].value);
    const kidsTicketAmount = parseInt(event.target[14].value);
    let allTickets: object[] = [];

    if (!isNaN(adultTicketAmount) && adultTicketAmount > 0) {
      allTickets.push({ type: TicketType.ADULT, amount: adultTicketAmount });
    }
    if (!isNaN(studentTicketAmount) && studentTicketAmount > 0) {
      allTickets.push({
        type: TicketType.STUDENT,
        amount: studentTicketAmount,
      });
    }
    if (!isNaN(pensionerTicketAmount) && pensionerTicketAmount > 0) {
      allTickets.push({
        type: TicketType.SENIOR,
        amount: pensionerTicketAmount,
      });
    }
    if (!isNaN(kidsTicketAmount) && kidsTicketAmount > 0) {
      allTickets.push({ type: TicketType.CHILD, amount: kidsTicketAmount });
    }

    let searchData = {
      departure: {
        location: event.target[0].value,
        time: new Date(event.target[9].value),
      },
      arrival: {
        location: event.target[4].value,
        time: new Date(event.target[9].value),
      },
      returnDeparture: {
        location: event.target[4].value,
        time: new Date(event.target[10].value),
      },
      returnArrival: {
        location: event.target[0].value,
        time: new Date(event.target[10].value),
      },
      tickets: allTickets,
    };
    setRequestData({ ...searchData });

    fetch(API_URL + '/booking/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(searchData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.data !== undefined) {
          setTripData(tripData.concat(data.data));
          setHide(!hide);
        } else {
          alert(
            "Det finns inga tillgängliga resor mellan dem stationerna som söktes på. Vänligen gör en ny sökning."
          );
        }
      });
  }

  function toggleDatePicker() {
    setReturnTrip(!returnTrip);
    let x = document.getElementById('returnDate');

    if (x!.style.display === 'inline') {
      x!.style.display = 'none';
    } else {
      x!.style.display = 'inline';
    }
  }

  function ToggleSearchContainer() {
    let x = document.getElementById('SearchContainer');
    let y = document.getElementById('searchResults');
    let z = document.getElementById('backButton');
    if (x != null && y != null && z != null) {
      if (x.style.display === 'none') {
        x.style.display = 'block';
        y.style.display = 'none';
        z.style.display = 'none';
      } else {
        x.style.display = 'none';
        y.style.display = 'block';
        z.style.display = 'block';
      }
    }
  }

  function fetchAvailableStations() {
    fetch(API_URL + '/station', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const stationNames: string[] = [];
        for (let station of data) {
          stationNames.push(station.locationName);
        }

        setStations(stations.concat(stationNames));
      });
  }

  let nav = useNavigate();

  function handleClick() {
    nav('/payment');
  }

  return (
    <div className='container text-center'>
      <div className='row'>
        <h1>Tåg bokningssystem - Group 7</h1>
      </div>
      <div id='SearchContainer' className='row mt-5'>
        <h2>Hej, Vart vill du resa?</h2>
        <div className='justify-content-center'>
          <form action='post' onSubmit={(event) => submitForm(event)}>
            <div className='form-row'>
              <div className='form-group col-md-8 mx-auto'>
                <div id='startForm' className='input-group'>
                  <label className='input-group-text' htmlFor='fromDestination'>
                    Från
                  </label>
                  <Autocomplete
                    options={stations}
                    style={{ width: 300 }}
                    renderInput={(params) => (
                      <TextField
                        className='fromDestination'
                        {...params}
                        label='Sök efter stationer'
                        variant='outlined'
                      />
                    )}
                  />
                  <label className='input-group-text' htmlFor='toDestination'>
                    Till
                  </label>
                  <Autocomplete
                    options={stations}
                    style={{ width: 300 }}
                    renderInput={(params) => (
                      <TextField
                        className='toDestination'
                        {...params}
                        label='Sök efter stationer'
                        variant='outlined'
                      />
                    )}
                  />
                </div>
              </div>
            </div>
            <div className='form-row'>
              <div className='form-group col-md-8 mx-auto'>
                <div className='form-check form form-check-inline'>
                  <label className='form-check-lable' htmlFor='returnTrip'>
                    Åter resa
                  </label>
                  <input
                    className='form-check-input'
                    type='checkbox'
                    name='returnTrip'
                    id='returnTrip'
                    onChange={() => toggleDatePicker()}
                  />
                </div>
                <div id='timeSelectContainer'>
                  <>
                    <DatePicker
                      format='yyyy-MM-dd HH:mm'
                      placeholder='Avgångs tid'
                    />
                    <span id='returnDate'>
                      <DatePicker
                        format='yyyy-MM-dd HH:mm'
                        placeholder='Ankomst tid'
                      />
                    </span>
                  </>
                </div>
                <div>
                  <label htmlFor=''>Vuxen</label>
                  <input
                    type='number'
                    name=''
                    id='adultTickets'
                    min='0'
                    value={adultNum}
                    onChange={(e: any) => setAdultNum(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor=''>Ungdom/Student</label>
                  <input
                    type='number'
                    name=''
                    id='studentTickets'
                    min='0'
                    value={studentNum}
                    onChange={(e: any) => setStudentNum(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor=''>Pensionär</label>
                  <input
                    type='number'
                    name=''
                    id='pensionerTickets'
                    min='0'
                    value={pensionerNum}
                    onChange={(e: any) => setPensionerNum(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor=''>Barn</label>
                  <input
                    type='number'
                    name=''
                    id='kidsTicket'
                    min='0'
                    value={kidsNum}
                    onChange={(e: any) => setKidsNum(e.target.value)}
                  />
                </div>
                <input
                  className='btn btn-success mt-2'
                  type='submit'
                  value='Sök'
                />
              </div>
            </div>
          </form>
        </div>
      </div>
      <button
        className='btn btn-secondary'
        onClick={() => ToggleSearchContainer()}
        id='backButton'>
        Tillbaka
      </button>
      {tripData.length > 0 ? (
        <SearchConponent
          returnTrip={returnTrip}
          trips={tripData}
          requestData={requestData}
        />
      ) : (
        <></>
      )}
      <button className='btn btn-primary' onClick={handleClick}>
        BETALSIDA FÖR TEST
      </button>
    </div>
  );
}

export default StartPage;
