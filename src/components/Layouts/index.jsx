import { MenuOutlined, ShoppingCartOutlined } from "@ant-design/icons"
import {
  Avatar,
  Badge,
  Col,
  Divider,
  Drawer,
  Dropdown,
  Layout,
  Menu,
  Row,
} from "antd"
import React, { useContext, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"
import Logo from "src/assets/images/logo/logo.png"
import Logo2 from "src/assets/images/logo/logo2.png"
import STORAGE, { clearStorage, getStorage, setStorage } from "src/lib/storage"
import { StoreContext } from "src/lib/store"
import UseWindowSize from "src/lib/useWindowSize"
import { resetState } from "src/redux/appGlobal"
import { setOpenLoginModal } from "src/redux/loginModal"
import ROUTER from "src/router"
import LayoutCommon from "../Common/Layout"
import SvgIcon from "../SvgIcon"
import MenuItemBreadcrumb, { MenuHeader } from "./MenuItems"
import CartSmall from "./component/CartSmall"
import ChangePasswordModal from "./component/ChangePasswordModal"
import Footer from "./component/Footer"
import ForgetPasswordModal from "./component/ForgetPasswordModal"
import LoginModal from "./component/LoginModal"
import ModalUserInfo from "./component/ModalUserInfo"
import RegisterModal from "./component/RegisterModal"
import { CustomMenuStyled, LayoutStyled, StyleMenuAccount } from "./styled"
import "./styles.scss"
import BreadcrumbHome from "./component/BreadcrumbHome/BreadcrumbHome"
import useDeviceType from "src/lib/useDeviceType"

const { Header, Content } = Layout

const MainLayout = ({ children }) => {
  const { isMobile } = useDeviceType()
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const { openLoginModal } = useSelector(state => state.loginModal)
  const { userInfo, listCart } = useSelector(state => state?.appGlobal)
  const isLogin = getStorage(STORAGE.TOKEN)
  const [open, setOpen] = useState(false)
  const [selectedKey, setSelectedKey] = useState(
    getStorage(STORAGE.KEY_MENU_ACTIVE) || ["/"],
  )
  const { isNotificationUpdate } = useContext(StoreContext)
  const [isModelNotification, setIsModelNotification] = isNotificationUpdate
  const [openRegisterModal, setOpenRegisterModal] = useState(false)
  const [openForgetPassModal, setOpenForgetPassModal] = useState(false)
  const [openInfoModal, setOpenInfoModal] = useState(false)
  const [openModalChangePass, setOpenModalChangePass] = useState(false)
  const [isTransparent, setIsTransparent] = useState(false)
  const [openDrawer, setOpenDrawer] = useState(false)

  const onClickMenu = key => {
    if (isModelNotification) {
      setIsModelNotification(false)
    }
    setStorage(STORAGE.KEY_MENU_ACTIVE, key.keyPath)
    setSelectedKey(key.key.keyPath)
    if (!key.key.includes("subkey")) navigate(key.key)
  }
  const handleLogout = () => {
    if (isLogin) {
      clearStorage()
      dispatch(resetState())
      return navigate(ROUTER?.HOME)
    }
  }
  const filterMenu = data =>
    data?.filter(o => {
      if (o?.children) {
        if (filterMenu(o?.children)?.length)
          o.children = filterMenu(o?.children)
        else delete o?.children
      }
      return !o?.hideOnMenu
    })

  const menuAccount = (
    <StyleMenuAccount>
      <div className="menu-account">
        <Menu className="dropdown-option">
          <div className="account-infor">
            <Menu.Item
              key="3"
              onClick={() => {
                setOpenInfoModal(true)
              }}
            >
              <div className="btn-function strok-btn-function">
                <SvgIcon name="user-info" />
                <span className="fw-400">Thông tin tài khoản</span>
              </div>
            </Menu.Item>
            <Menu.Item
              key="4"
              onClick={() => {
                navigate(ROUTER.DS_DON_DAT_HANG)
              }}
            >
              <div className="btn-function strok-btn-function">
                <SvgIcon name="document" />
                <span className="fw-400">Danh sách đơn hàng</span>
              </div>
            </Menu.Item>
            <Menu.Item
              key="6"
              onClick={() => {
                setOpenModalChangePass(true)
              }}
            >
              <div className="btn-function strok-btn-function">
                <SvgIcon name="reset-pass" />
                <span className="fw-400">Đổi mật khẩu</span>
              </div>
            </Menu.Item>
            <Menu.Item
              key="7"
              style={{ color: "#ED1117" }}
              onClick={handleLogout}
            >
              <div className="btn-logout">
                <SvgIcon name="logoutIcon" />
                Đăng xuất
              </div>
            </Menu.Item>
          </div>
        </Menu>
      </div>
    </StyleMenuAccount>
  )

  const handleScroll = () => {
    let scrollPosition = window.scrollY || window.pageYOffset
    if (scrollPosition >= 40) {
      setIsTransparent(false)
    } else {
      setIsTransparent(true)
    }
  }
  useEffect(() => {
    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  useEffect(() => {
    let key = location?.pathname
    setSelectedKey([key])
    if (key === ROUTER.HOME) {
      setIsTransparent(true)
    } else {
      setIsTransparent(false)
    }
  }, [location])

  return (
    <LayoutStyled>
      <Header
        className={`header-background ${
          location?.pathname === ROUTER.HOME && isTransparent && !isMobile
            ? "transparent"
            : ""
        }`}
      >
        <div className="d-flex-start">
          <div className="w-100">
            {!isMobile ? (
              React.createElement(LayoutCommon, {
                children: (
                  <Row
                    gutter={36}
                    className=" pt-5 pb-5 d-flex align-items-center justify-content-space-between"
                    style={{
                      margin: "auto",
                    }}
                  >
                    <Col
                      className={`d-flex-center justify-content-flex-start nowrap`}
                      style={{
                        whiteSpace: "nowrap",
                        height: "40px",
                        paddingLeft: 0,
                        width: "fit-content",
                      }}
                    >
                      <div
                        className={"mr-40"}
                        onClick={() => {
                          navigate(ROUTER.HOME)
                        }}
                      >
                        <span
                          className={`fw-600 d-flex-center h-100pe ${
                            UseWindowSize.isMobile() ? "fs-12" : "fs-20"
                          }`}
                        >
                          <img
                            src={
                              location?.pathname === ROUTER.HOME &&
                              isTransparent
                                ? Logo
                                : Logo2
                            }
                            className="logo mr-12"
                            alt="logo"
                          />
                          <div className="logo-text pointer">Farm Connect</div>
                        </span>
                      </div>
                    </Col>
                    <Col
                      style={{ width: 0 }}
                      className="d-flex algin-items-center justify-content-flex-end"
                      flex={"auto"}
                    >
                      <CustomMenuStyled className="mr-40">
                        <Menu
                          onClick={key => onClickMenu(key)}
                          selectedKeys={selectedKey}
                          mode="horizontal"
                          items={MenuHeader()}
                        />
                      </CustomMenuStyled>
                      <Row
                        gutter={30}
                        className="align-items-center layout-action"
                      >
                        {!!isLogin ? (
                          <div className="d-flex justify-content-flex-end align-items-center">
                            {location.pathname !== ROUTER.CHI_TIET_GIO_HANG && (
                              <Badge
                                count={listCart?.length}
                                overflowCount={99}
                                size="middle"
                                className="badge-count mr-12 pointer"
                              >
                                <Dropdown
                                  overlay={<CartSmall />}
                                  placement="bottomRight"
                                  arrow={{ pointAtCenter: true }}
                                >
                                  <div className="wrap-icon-cart">
                                    <ShoppingCartOutlined className="fs-18" />
                                  </div>
                                </Dropdown>
                              </Badge>
                            )}
                            {/* <Notification /> */}
                            <Dropdown
                              overlay={menuAccount}
                              overlayStyle={{ minWidth: "200px" }}
                            >
                              <Row gutter={5} className="pointer ">
                                <Col>
                                  <div className="account-infor-avatar">
                                    <Avatar
                                      // src={userInfo?.avatar}
                                      size={32}
                                      className="style-avt mr-8"
                                      icon={<SvgIcon name="user-header" />}
                                    />
                                    <span className="mr-8 max-line1">
                                      {userInfo?.username}
                                    </span>
                                    <SvgIcon name="arrow-down-primary" />
                                  </div>
                                </Col>
                              </Row>
                            </Dropdown>
                          </div>
                        ) : (
                          <div className="d-flex align-items-center h-100 ">
                            <Row
                              // onClick={() => navigate(ROUTER.DANG_NHAP)}
                              onClick={() => dispatch(setOpenLoginModal(true))}
                              className="align-items-center pointer login-item"
                            >
                              <SvgIcon
                                name="user_login"
                                className="login-icon"
                              />
                              <span className="login-item_text">Đăng nhập</span>
                            </Row>
                            <Row
                              // onClick={() => navigate(ROUTER.DANG_KY)}
                              onClick={() => setOpenRegisterModal(true)}
                              className="align-items-center pointer login-item"
                            >
                              <SvgIcon
                                name="register"
                                className="register-icon"
                              />
                              <span className="login-item_text">Đăng ký</span>
                            </Row>
                          </div>
                        )}
                      </Row>
                    </Col>
                  </Row>
                ),
              })
            ) : (
              <div className="d-flex align-items-center justify-content-space-between p-12 pl-16 pr-16">
                <MenuOutlined
                  style={{ color: "#fff" }}
                  className="fs-16 pointer"
                  onClick={() => setOpenDrawer(true)}
                />
                {!!isLogin && (
                  <Badge
                    count={listCart?.length}
                    overflowCount={99}
                    size="small"
                    onClick={() => navigate(ROUTER.CHI_TIET_GIO_HANG)}
                  >
                    <ShoppingCartOutlined
                      style={{ color: "#fff" }}
                      className="fs-18 pointer"
                      onClick={() => navigate(ROUTER.CHI_TIET_GIO_HANG)}
                    />
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </Header>

      <BreadcrumbHome />
      <Layout>
        <Content className="site-layout-background">
          <div
            className="w-100"
            style={
              location.pathname === ROUTER.HOME
                ? { position: "relative", top: -53 }
                : { top: 0 }
            }
          >
            {children}
          </div>
          <Footer />
        </Content>
      </Layout>
      <Drawer
        title=""
        placement="left"
        onClose={() => setOpen(false)}
        open={open}
        className="menu-custom"
      >
        <Menu
          onClick={key => onClickMenu(key)}
          selectedKeys={selectedKey}
          mode="inline"
          items={filterMenu(MenuItemBreadcrumb())}
        />
      </Drawer>
      {!!openLoginModal && (
        <LoginModal
          openLoginModal={openLoginModal}
          handleCancel={() => dispatch(setOpenLoginModal(false))}
          handleRegister={() => setOpenRegisterModal(true)}
          setOpenForgetPassModal={() => setOpenForgetPassModal(true)}
        />
      )}
      {!!openRegisterModal && (
        <RegisterModal
          open={openRegisterModal}
          handleCancel={() => setOpenRegisterModal(false)}
          handleLogin={() => dispatch(setOpenLoginModal(true))}
        />
      )}
      {!!openInfoModal && (
        <ModalUserInfo
          open={openInfoModal}
          onCancel={() => setOpenInfoModal(false)}
          handleChangePass={() => setOpenModalChangePass(true)}
        />
      )}
      {!!openModalChangePass && (
        <ChangePasswordModal
          open={openModalChangePass}
          onCancel={() => setOpenModalChangePass(false)}
        />
      )}
      {!!openForgetPassModal && (
        <ForgetPasswordModal
          open={openForgetPassModal}
          onCancel={() => setOpenForgetPassModal(false)}
        />
      )}
      {isMobile && (
        <Drawer
          title={
            <div style={{ color: "var(--color-brown)" }} className="fs-18">
              Farm Connects
            </div>
          }
          placement={"left"}
          closable={false}
          onClose={() => setOpenDrawer(false)}
          open={openDrawer}
          style={{ width: "80%", marginTop: 40 }}
          className="menu-small"
        >
          <div
            className={`menu-item fw-600 fs-16 pl-0 ${
              selectedKey?.[0] === ROUTER.HOME ? "selected" : ""
            }`}
            onClick={() => {
              setOpenDrawer(false)
              navigate(ROUTER.HOME)
            }}
          >
            Trang chủ
          </div>
          <div
            className={`menu-item fw-600 fs-16 pl-0 ${
              selectedKey?.[0] === ROUTER.DS_SAN_PHAM ? "selected" : ""
            }`}
            onClick={() => {
              setOpenDrawer(false)
              navigate(ROUTER.DS_SAN_PHAM)
            }}
          >
            Sản phẩm
          </div>
          <Divider />
          {!isLogin ? (
            <>
              <div
                className={`menu-item fw-600 fs-14 pl-0 `}
                onClick={() => {
                  setOpenDrawer(false)
                  dispatch(setOpenLoginModal(true))
                }}
              >
                Đăng nhập
              </div>
              <div
                className={`menu-item fw-600 fs-14 pl-0 `}
                onClick={() => {
                  setOpenDrawer(false)
                  setOpenRegisterModal(true)
                }}
              >
                Đăng ký
              </div>
            </>
          ) : (
            <div>
              <div
                className={`menu-item fw-600 fs-14 pl-0 `}
                onClick={() => {
                  setOpenDrawer(false)
                  setOpenInfoModal(true)
                }}
              >
                Thông tin tài khoản
              </div>
              <div
                className={`menu-item fw-600 fs-14 pl-0 `}
                onClick={() => {
                  setOpenDrawer(false)
                  navigate(ROUTER.DS_DON_DAT_HANG)
                }}
              >
                Danh sách đơn hàng
              </div>
              <div
                className={`menu-item fw-600 fs-14 pl-0 `}
                onClick={() => {
                  setOpenDrawer(false)
                  setOpenModalChangePass(true)
                }}
              >
                Đổi mật khẩu
              </div>
              <div
                className={`menu-item fw-600 fs-14 pl-0 `}
                onClick={() => {
                  setOpenDrawer(false)
                  handleLogout()
                }}
                style={{ color: "#ED1117" }}
              >
                Đăng xuất
              </div>
            </div>
          )}
        </Drawer>
      )}
    </LayoutStyled>
  )
}

export default MainLayout
