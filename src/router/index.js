const isAdminMiddleware = require("@/middleware/isAdmin");
const { questionCreate, questionDelete } = require("@/service/question");
const checkLogin = require("@/middleware/checkLogin");
const {
  userRegister,
  userLogin,
  userDelete,
  userUpdate,
  userQueryByPage,
  userLogout,
  getLoginUserDetail,
  getUserDtailById,
} = require("@/service/user");

const {
  questionBankQueryByPage,
  questionBankDelete,
  questionBankUpdate,
  questionBankCreate,
  questionBankAdultLogs,
  questionBankAdult,
  questionBankDetailById,
} = require("@/service/questionBank");
const {
  tagCreate,
  tagDelete,
  tagUpdate,
  tagQueryByPage,
  getTagDetail,
} = require("@/service/tag");
const {
  correlationQuestionBank,
  relinkQuestionBank,
  questionDetail,
  questionAdult,
  questionAdultLogs,
  questionUpdate,
  questionQueryByPage,
} = require("../service/question");
const { saveFileToOss } = require("@/service/oss");
const multerMiddleware = require("@/middleware/file");

const userPrefix = "/user";
const tagPrefix = "/tag";
const questionBankprefix = "/questionBank";
const questionPrefix = "/question";

const initRoutes = (server) => {
  // oss服务
  server.setRoute("/file/upload", saveFileToOss, "post", [
    checkLogin,
    isAdminMiddleware,
    multerMiddleware.single("avatar"),
  ]);

  // 用户服务
  server.setRoute(userPrefix + "/register", userRegister, "post", [
    checkLogin,
    isAdminMiddleware,
  ]);
  server.setRoute(userPrefix + "/login", userLogin, "post", [
    checkLogin,
    isAdminMiddleware,
  ]);
  server.setRoute(userPrefix + "/delete", userDelete, "get", [
    checkLogin,
    isAdminMiddleware,
  ]);
  server.setRoute(userPrefix + "/update", userUpdate, "post", [
    checkLogin,
    isAdminMiddleware,
  ]);
  server.setRoute(userPrefix + "/list", userQueryByPage, "get", [
    checkLogin,
    isAdminMiddleware,
  ]);
  server.setRoute(userPrefix + "/loginUser/detail", getLoginUserDetail, "get");
  server.setRoute(userPrefix + "/detail", getUserDtailById, "get");
  server.setRoute(userPrefix + "/logout", userLogout, "get", [checkLogin]);

  // 标签服务
  server.setRoute(tagPrefix + "/create", tagCreate, "post", [
    checkLogin,
    isAdminMiddleware,
  ]);
  server.setRoute(tagPrefix + "/delete", tagDelete, "get", [
    checkLogin,
    isAdminMiddleware,
  ]);
  server.setRoute(tagPrefix + "/update", tagUpdate, "post", [
    checkLogin,
    isAdminMiddleware,
  ]);
  server.setRoute(tagPrefix + "/list", tagQueryByPage, "get", [
    checkLogin,
    isAdminMiddleware,
  ]);
  server.setRoute(tagPrefix + "/detail", getTagDetail, "get", [
    checkLogin,
    isAdminMiddleware,
  ]);

  // 题库服务
  server.setRoute(questionBankprefix + "/create", questionBankCreate, "post", [
    checkLogin,
    isAdminMiddleware,
  ]);
  server.setRoute(questionBankprefix + "/list", questionBankQueryByPage, "get");
  server.setRoute(questionBankprefix + "/delete", questionBankDelete, "get", [
    checkLogin,
    isAdminMiddleware,
  ]);
  server.setRoute(questionBankprefix + "/update", questionBankUpdate, "post", [
    checkLogin,
    isAdminMiddleware,
  ]);
  server.setRoute(questionBankprefix + "/adult", questionBankAdult, "post", [
    checkLogin,
    isAdminMiddleware,
  ]);
  server.setRoute(
    questionBankprefix + "/adultLogs",
    questionBankAdultLogs,
    "get",
    [checkLogin, isAdminMiddleware],
  );
  server.setRoute(
    questionBankprefix + "/detail",
    questionBankDetailById,
    "get",
  );

  // 题目服务
  server.setRoute(questionPrefix + "/create", questionCreate, "post", [
    checkLogin,
    isAdminMiddleware,
  ]);
  server.setRoute(questionPrefix + "/delete", questionDelete, "get", [
    checkLogin,
    isAdminMiddleware,
  ]);
  server.setRoute(
    questionPrefix + "/correlationQuestionBank",
    correlationQuestionBank,
    "post",
    [checkLogin, isAdminMiddleware],
  );
  server.setRoute(
    questionPrefix + "/relinkQuestionBank",
    relinkQuestionBank,
    "post",
    [checkLogin, isAdminMiddleware],
  );
  server.setRoute(questionPrefix + "/detail", questionDetail, "get");
  server.setRoute(questionPrefix + "/adult", questionAdult, "post", [
    checkLogin,
    isAdminMiddleware,
  ]);
  server.setRoute(questionPrefix + "/adultLogs", questionAdultLogs, "get", [
    checkLogin,
    isAdminMiddleware,
  ]);
  server.setRoute(questionPrefix + "/update", questionUpdate, "post", [
    checkLogin,
    isAdminMiddleware,
  ]);
  server.setRoute(questionPrefix + "/list", questionQueryByPage, "get");
};

module.exports = initRoutes;
