const Course = artifacts.require("CourseCtr");

module.exports = function (deployer) {
  deployer.deploy(Course);
};
