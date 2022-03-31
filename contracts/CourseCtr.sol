// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract CourseCtr {
    address public owner;
    mapping(address => Course[]) public CourseUser;
    mapping(uint => Course) public CourseList;

    struct Course {
        address creator;
        uint courseId;
    }

    constructor() {
        owner = msg.sender;
    }

    modifier isOwner() {
        require (msg.sender == owner, "Only allow owner create course");
        _;
    }

    event createCourseEvent(address, uint);
    function createCourse(uint courseId) public {
        CourseList[courseId] = Course(msg.sender, courseId);

        emit createCourseEvent(msg.sender, courseId);
    }

    function deleteCourse(uint courseId) public isOwner {
        delete CourseList[courseId];
    }

    event buyCourseEvent(address, address, uint, uint);
    function buyCourse(uint courseId) public payable {
        Course memory course = CourseList[courseId];
        require(msg.sender != course.creator);
        payable(course.creator).transfer(msg.value);

        emit buyCourseEvent(msg.sender, course.creator, courseId, msg.value);
    }
}