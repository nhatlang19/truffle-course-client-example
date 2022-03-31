export const createCourse = ({name, price, description, address_owner}) => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({name, price, description, address_owner})
    };
    return fetch('/api/courses', requestOptions).then(res => res.json());
}

export const fetchCoursesByOwner = (address_owner) => {
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    };
    return fetch(`/api/courses/${address_owner}`, requestOptions).then(res => res.json());
}

export const fetchCoursesExceptOwner = (address_owner) => {
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    };
    return fetch(`/api/courses/list/${address_owner}`, requestOptions).then(res => res.json());
}