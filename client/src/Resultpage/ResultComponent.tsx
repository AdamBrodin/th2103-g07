import moment from 'moment';
import 'rsuite/dist/rsuite.min.css';
import { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BookingContext } from '../Contexts/BookingContext';
import './ResultComponent.css';

function ResultComponent(data) {
  let nav = useNavigate();
  const [bookingContext, updateContext] = useContext(BookingContext);
  const [radioValidation, setRadioValidation] = useState(0);
  let lastSelectedDepartTrip: HTMLElement | null = null;
  let lastSelectedReturnTrip: HTMLElement | null = null;
  let lastSelectedTripId: string = "";
  let lastSelectedReturnTripId: string = "";

  function getTicket(DepartId: string, returnId: string) {
    // Get train object from id

    let currentDepartTrip = document.getElementById(DepartId);
    let currentReturnTrip;
    if (returnId) {
      currentReturnTrip = document.getElementById(returnId);
    }

    if (lastSelectedDepartTrip != null && currentDepartTrip != null) {
      lastSelectedDepartTrip.classList.remove("selectedTicket");
    }
    if (lastSelectedReturnTrip != null && currentReturnTrip != null) {
      lastSelectedReturnTrip.classList.remove("selectedTicket");
    }

    if (currentDepartTrip != null) {
      currentDepartTrip.classList.add("selectedTicket");
    }
    if (currentReturnTrip != null) {
      currentReturnTrip.classList.add("selectedTicket");
    }

    if (currentDepartTrip != null) {
      lastSelectedDepartTrip = currentDepartTrip;
    }
    if (currentReturnTrip != null) {
      lastSelectedReturnTrip = currentReturnTrip;
    }
  }

  function toggleRadio(e: any) {
    const Id = e.target.id.split("-");

    setRadioValidation(1);
    const outBoundTrip = (
      bookingContext?.dbData?.OutboundTrips as any[]
    ).filter((trip) => trip.train.id === Id[1]);

    if (Id[0] === "SecondClass") {
      updateContext({
        ...bookingContext,
        SelectedTrain: {
          class: "Second Class",
          trainID: Id[1],
          stops: outBoundTrip[0].stops,
          Time: document.getElementById(Id[1])?.textContent?.slice(0, 13),
          TotalTicketPrice:
            bookingContext.dbData.OutboundTrips[0].estimatedPrices[1].price,
        },
      });
    } else {
      updateContext({
        ...bookingContext,
        SelectedTrain: {
          class: "First Class",
          trainID: Id[1],
          stops: outBoundTrip[0].stops,
          Time: document.getElementById(Id[1])?.textContent?.slice(0, 13),
          TotalTicketPrice:
            bookingContext.dbData.OutboundTrips[0].estimatedPrices[0].price,
        },
      });
    }

    if (e.target.id !== "SecondClass-" + Id[1]) {
      let esh: any = document.getElementById("SecondClass-" + Id[1]);
      esh.checked = false;
    } else if (e.target.id !== "FirstClass-" + Id[1]) {
      let esh: any = document.getElementById("FirstClass-" + Id[1]);
      esh.checked = false;
    }
    if (lastSelectedTripId !== e.target.id && lastSelectedTripId !== "") {
      let esh: any = document.getElementById(lastSelectedTripId);
      esh.checked = false;
    }

    lastSelectedTripId = e.target.id;
  }
  function toggleReturnRadio(e: any) {
    const Id = e.target.id.split("-");
    setRadioValidation(2);

    const returnTrip = (bookingContext?.dbData?.ReturnTrips as any[]).filter(
      (trip) => trip.train.id === Id[1]
    );

    if (Id[0] === "ReturnSecondClass") {
      updateContext({
        ...bookingContext,
        SelectedReturnTrain: {
          class: "Second Class",
          trainID: Id[1],
          stops: returnTrip[0].stops ?? null,
          Time: document.getElementById(Id[1])?.textContent?.slice(0, 13),
          TotalTicketPrice:
            bookingContext.dbData.ReturnTrips[0].estimatedPrices[1].price,
        },
      });
    } else {
      updateContext({
        ...bookingContext,
        SelectedReturnTrain: {
          class: "First Class",
          trainID: Id[1],
          stops: returnTrip[0].stops ?? null,
          Time: document.getElementById(Id[1])?.textContent?.slice(0, 13),
          TotalTicketPrice:
            bookingContext.dbData.ReturnTrips[0].estimatedPrices[0].price,
        },
      });
    }

    if (e.target.id !== "ReturnSecondClass-" + Id[1]) {
      let esh: any = document.getElementById("ReturnSecondClass-" + Id[1]);
      esh.checked = false;
    } else if (e.target.id !== "ReturnFirstClass-" + Id[1]) {
      let esh: any = document.getElementById("ReturnFirstClass-" + Id[1]);
      esh.checked = false;
    }
    if (
      lastSelectedReturnTripId !== e.target.id &&
      lastSelectedReturnTripId !== ""
    ) {
      let esh: any = document.getElementById(lastSelectedReturnTripId);
      esh.checked = false;
    }
    lastSelectedReturnTripId = e.target.id;
  }

  function nextPage() {
    if (bookingContext.searchData.returnTrip === true) {
      if (radioValidation === 2) {
        if (bookingContext.SelectedTrain.class === "SecondClass") {
          nav("/additional-choices");
        } else {
          nav("/payment");
        }
      } else {
        alert("Var vänlig välj ett tåg, tack!");
      }
    } else if (radioValidation === 1) {
      if (bookingContext.SelectedTrain.class === "SecondClass") {
        nav("/additional-choices");
      } else {
        nav("/payment");
      }
    } else {
      alert("Var vänlig välj ett tåg, tack!");
    }
  }

  return (
    <>
      <div className='container mt-5'>
        <div id='searchResults'>
          <h2 className='fromTo text-center'>Utresa</h2>
          <p className='fromTo text-center'>
            {data.data.searchData.departure.location} -{' '}
            {data.data.searchData.arrival.location}
          </p>
          <p className='fromTo text-center'>
            {moment(data.data.searchData.departure.time).format('Do MMMM YYYY')}
          </p>
          <table id='departTrip' className='table'>
            <thead className='thead-dark fromTo text-center'>
              <tr>
                <th>Tid</th>
                <th>1 klass</th>
                <th>2 klass</th>
              </tr>
            </thead>
            <tbody className='fromTo text-center'>
              {data.data.dbData.OutboundTrips.map((trip: any) => {
                return (
                  <tr
                    onClick={() => getTicket(trip.train.id, "")}
                    id={trip.train.id}
                    key={trip.train.id}>
                    <td>
                      {moment(trip.departure.time).format("HH:mm")} -{" "}
                      {moment(trip.arrival.time).format("HH:mm")}
                      <p>
                        restid
                        {" " +
                          moment
                            .duration(
                              moment(trip.departure.time).diff(
                                moment(trip.arrival.time)
                              )
                            )
                            .humanize()}
                      </p>
                    </td>
                    <td>
                      <label htmlFor={"FirstClass-" + trip.train.id}>
                        {trip.estimatedPrices[0].price + " :-"}
                      </label>
                      <input
                        type='radio'
                        name={'FirstClass-' + trip.train.id}
                        id={'FirstClass-' + trip.train.id}
                        onChange={(e) => toggleRadio(e)}
                      />
                    </td>
                    <td>
                      <label htmlFor={"SecondClass-" + trip.train.id}>
                        {trip.estimatedPrices[1].price + " :-"}
                      </label>
                      <input
                        type='radio'
                        name={'SecondClass-' + trip.train.id}
                        id={'SecondClass-' + trip.train.id}
                        onChange={(e) => toggleRadio(e)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {data.data.searchData.returnTrip ? (
            <>
              <h2 className='fromTo text-center'>Återresa</h2>
              <p className='fromTo text-center'>
                {data.data.searchData.returnDeparture.location} -{' '}
                {data.data.searchData.returnArrival.location}
              </p>
              <p className='fromTo text-center'>
                {moment(data.data.searchData.returnDeparture.time).format(
                  "Do MMMM YYYY"
                )}
              </p>
              <table id='returnTrip' className='table'>
                <thead className='thead-dark fromTo text-center'>
                  <tr>
                    <th>Tid</th>
                    <th>1 klass</th>
                    <th>2 klass</th>
                  </tr>
                </thead>
                <tbody className='fromTo text-center'>
                  {data.data.dbData.ReturnTrips.map((trip: any) => (
                    <tr
                      onClick={() => getTicket(trip.train.id, "")}
                      id={trip.train.id}
                      key={trip.train.id}>
                      <td>
                        {moment(trip.departure.time).format("HH:mm")} -{" "}
                        {moment(trip.arrival.time).format("HH:mm")}
                        <p>
                          restid
                          {" " +
                            moment
                              .duration(
                                moment(trip.departure.time).diff(
                                  moment(trip.arrival.time)
                                )
                              )
                              .humanize()}
                        </p>
                      </td>
                      <td>
                        <label htmlFor={"FirstClass-" + trip.train.id}>
                          {trip.estimatedPrices[0].price + " :-"}
                        </label>
                        <input
                          type='radio'
                          name={'FirstClass-' + trip.train.id}
                          id={'ReturnFirstClass-' + trip.train.id}
                          onChange={(e) => toggleReturnRadio(e)}
                        />
                      </td>
                      <td>
                        <label htmlFor={"FirstClass-" + trip.train.id}>
                          {trip.estimatedPrices[1].price + " :-"}
                        </label>
                        <input
                          type='radio'
                          name={'SecondClass-' + trip.train.id}
                          id={'ReturnSecondClass-' + trip.train.id}
                          onChange={(e) => toggleReturnRadio(e)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : (
            <></>
          )}
          <div className='row'>
            <div className='col-md-6'>
              <Link to='/'>
                <button className='btn back-button text-left'>Tillbaka</button>
              </Link>
            </div>
            <div className='col-md-6'>
              <button
                id='continueButton'
                className='btn confirm-button'
                onClick={nextPage}>
                Fortsätt
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ResultComponent;
