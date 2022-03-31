import './App.css';

import AddCourse from './AddCourse';
import {useEffect, useState} from "react";
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider'
import { loadContract } from './utils/LoadContract';
import { fetchCoursesByOwner, fetchCoursesExceptOwner } from './services/Course';
import { fetchByCourseIdAndAddress, saveCourseUser } from './services/CourseUser';

function App() {
  const [modalActive, setModelActive] = useState(false);
  const [courses, setCourses] = useState([]);

  const [showAddCourse, setShowAddCourse] = useState(true);

  const [isConnectedMM, setConnectedMM] = useState(false);
  const [account, setAccount] = useState(null);
  const [web3Api, setWeb3Api] = useState({
    provider: null,
    web3: null,
    contract: null
  });

  useEffect(() => {
    const loadProvider = async function() {
      const provider = await detectEthereumProvider();
      const contract = await loadContract('CourseCtr', provider);
      if (provider) {
        setWeb3Api({
          provider,
          web3: new Web3(),
          contract: contract
        });
        setConnectedMM(true);
      } else {
        setConnectedMM(false);
      }
    }
    loadProvider();
  }, []);

  useEffect(() => {
    const triggerEvent = async () => {
      console.log('triggerEvent')
      const {contract, web3} = web3Api;
      contract.buyCourseEvent().on('data', event => {
        console.log('event <<<<<<', event)
        saveCourseUser({
          address_user: event.returnValues[0],
          course_id: event.returnValues[2],
          price: web3.utils.fromWei(event.returnValues[3], 'ether'),
        })
      });
    };
    web3Api.contract && triggerEvent();
  }, [web3Api.contract]);

  useEffect(() => {
    account && getCourses();
  }, [account]);

  const Connect =  () => {
     web3Api.provider.request({method: "eth_requestAccounts"}).then(data => {
      setAccount(data[0]);
     });
  }

  // load courses from local Storage
  const getCourses = () => {
    if (account) {
      setShowAddCourse(true);
      fetchCoursesByOwner(account).then(courses => {
        const data = courses.data.map((course, index) => courseUI(index, course, 0));
        setCourses(data);
      });
    }
  };

  function getAllCourses(){
    if (account) {
      setShowAddCourse(false);
      fetchCoursesExceptOwner(account).then(courseData => {
        const data = courseData.data.map((course, index) => courseUI(index, course, 1));
        setCourses(data);
      });
    } else {
      alert('Please connect MM first')
    }
  };

  const courseUI = (key, course, index) => {
    const img = `https://picsum.photos/id/${key + 1019}/1280/960`;
    const {name, price, description, created_at, id} = course;
    return (
      <div key={key} className="column is-one-quarter">
          <div className="card">
            <div className="card-image">
              <figure className="image is-4by3">
                <img src={img} />
              </figure>
            </div>
            <div className="card-content">
              <div className="media">
                <div className="media-content">
                  <p className="title is-4">{name}</p>
                  <p className="subtitle is-6">Price: {price} ETH</p>
                </div>
              </div>

              <div className="content">
                {description}
                <br />
                <time dateTime="2016-1-1">{created_at}</time>
               
                <div className="buttons is-right">
                { index == 1 && <button className="button is-primary" onClick={() => buy(id, price)}>Buy</button>}
                </div>
              </div>
            </div>
          </div>
      </div>
    )
  }

  const addCourse = () => {
    if (account) {
      setModelActive(true);
    } else {
      alert('Please connect MM first')
    }
  }

  const buy = async (id, price) => {
    const {contract, web3} = web3Api;
    const data = await fetchByCourseIdAndAddress(id, account);
    if (!data.data) {
      contract.buyCourse(id, {
        from: account,
        value: web3.utils.toWei(price + "", 'ether')
      }).then ((data) => {
        console.log(data);
      });
    } else {
      alert('You did buy this course');
    }
  }

  return (
    <div className="course-wrapper">
      <div className="course container">
        <h1 className="title is-1">Course</h1>
        <div className="buttons is-left">
          <a className="button is-primary" onClick={() => Connect(true)}>Connect Metamask</a>
          <h3 className='is-3'>Account Address: {account ? account : 'Account Denied'}</h3>
        </div>
        <div className="buttons is-left">
          <a className="button is-primary" href="javascript:void(0);" onClick={getCourses}>View My Courses</a>
          <a className="button is-secondary" href="javascript:void(0);" onClick={getAllCourses}>View All Courses</a>
        </div>
        <div className="buttons is-right">
          {showAddCourse && <a className="button is-primary" href="javascript:void(0);" onClick={addCourse}>Add Course</a>}
        </div>
        <div className="columns is-desktop is-multiline">
          {courses}
        </div>
        <AddCourse modalActive={modalActive} setModelActive={setModelActive} getCourses={getCourses} web3Api={web3Api} account={account} />
      </div>
    </div>
  )
}

export default App;
