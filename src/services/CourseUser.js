
export const fetchByCourseIdAndAddress = (course_id, address_owner) => {
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    };
    return fetch(`/api/course_users/${course_id}/${address_owner}`, requestOptions).then(res => res.json());
}

export const saveCourseUser = ({price, course_id, address_user}) => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({price, course_id, address_user})
    };
    return fetch('/api/course_users', requestOptions).then(res => res.json());
}