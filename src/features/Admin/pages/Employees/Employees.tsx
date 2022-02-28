/* eslint-disable no-underscore-dangle */
import {
  makeStyles,
  InputAdornment,
  Paper,
  TableBody,
  TableCell,
  TableRow,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  IconButton,
} from '@material-ui/core';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Search as SearchIcon,
  Add as AddIcon,
  FilterList as FilterIcon,
  HighlightOff,
} from '@material-ui/icons';
import { useHistory, useLocation } from 'react-router-dom';
import _ from 'lodash';
import clsx from 'clsx';
import queryString from 'query-string';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { Skeleton } from '@material-ui/lab';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import Input from '../../../../components/controls/Input';
import Button from '../../../../components/controls/Button';
import useTable from '../../../../common/customhooks/useTable';
import Select from '../../../../components/controls/Select';
import Notification from '../../../../components/Notification/Notification';
import { getFilterEmployees, selectEmployees } from './employeesSlice';
import { IEmployee } from './pages/CreateEmployee/CreateEmployee';

export interface IGetEmployee extends IEmployee {
  _id: string;
}

const useStyles = makeStyles(theme => ({
  pageContent: {
    margin: theme.spacing(1),
    padding: theme.spacing(3),
  },
  flexFilterGroup: {
    display: 'flex',
    alignItems: 'center',
  },
  searchInput: {
    '& .MuiOutlinedInput-input-318': {
      padding: '11.5px 14px',
      fontSize: '0.95rem',
    },

    '& .MuiOutlinedInput-input-317': {
      padding: '11.5px 14px',
      fontSize: '0.95rem',
      width: 120,
    },

    '& input': {
      padding: '11.5px 14px',
      fontSize: '0.95rem',
      width: 120,
    },

    '& .MuiOutlinedInput-input-333': {
      padding: '11.5px 14px',
      fontSize: '0.95rem',
      width: 120,
    },

    '& .MuiOutlinedInput-input': {
      padding: '11.5px 14px',
      fontSize: '0.95rem',
      width: 120,
    },
  },

  selectInput: {
    marginBottom: '0 !important',
    '& .MuiOutlinedInput-input-318': {
      padding: '11.5px 14px',
      fontSize: '0.95rem',
      width: 120,
    },

    '& input': {
      padding: '11.5px 14px',
      fontSize: '0.95rem',
      width: 120,
    },

    '& div > div': {
      padding: '11.5px 14px',
      fontSize: '0.95rem',
      width: 120,
    },

    '& .MuiOutlinedInput-input-333': {
      padding: '11.5px 14px',
      fontSize: '0.95rem',
      width: 120,
    },

    '& .MuiOutlinedInput-input-317': {
      padding: '11.5px 14px',
      fontSize: '0.95rem',
      width: 120,
    },

    '& .MuiOutlinedInput-input': {
      padding: '11.5px 14px',
      fontSize: '0.95rem',
      width: 120,
    },
  },

  filterButton: {
    [theme.breakpoints.down('md')]: {
      marginBottom: '1rem',
    },
  },
  buttonResp: {
    [theme.breakpoints.down('xs')]: {
      fontSize: '0.8rem',
      padding: '10px 10px',
    },
  },
  newButton: {
    marginLeft: '1rem',
    backgroundColor: theme.palette.success.main,
    '&:hover': {
      backgroundColor: '#2e7d32',
      transition: 'backgroundColor ease-in-out 0.3s',
    },
  },
  '.MuiOutlinedInput-input': {
    padding: '11.5px 14px',
  },
  colorActive: {
    color: 'green',
  },
  colorInActive: {
    color: 'red',
  },
  typoHeader: {
    marginBottom: theme.spacing(2),
  },
  toolbarAction: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  filterResponsive: {
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column !important',
    },
    [theme.breakpoints.down('md')]: {
      flexDirection: 'row',
    },
  },
  actionResponsive: {
    [theme.breakpoints.down('md')]: {
      display: 'flex',
      flexDirection: 'column-reverse',
      marginBottom: '0.5rem',
    },
  },
  margin: {},
}));

export interface ISelectFormat {
  value: number | string;
  label: string;
}

const Employees = () => {
  const { employees, totalEmployees, statusInfo, isLoading } =
    useAppSelector(selectEmployees);

  const { t } = useTranslation();

  const statusEmployee: ISelectFormat[] = [
    {
      value: 1,
      label: t('employees.active'),
    },
    { value: 0, label: t('employees.inActive') },
  ];

  const headCells = [
    { id: 'id', label: t('employees.orders'), disableSorting: true },
    { id: 'fullName', label: t('employees.fullName') },
    { id: 'birthday', label: t('employees.birthday'), disableSorting: true },
    { id: 'gender', label: t('employees.gender') },
    { id: 'status', label: t('employees.status'), disableSorting: true },
    { id: 'phoneNumber', label: t('employees.phone'), disableSorting: true },
  ];

  const location = useLocation();
  const history = useHistory();
  const [notify, setNotify] = useState({
    isOpen: false,
    message: '',
    type: '',
  });

  useEffect(() => {
    if (statusInfo) {
      setNotify({
        isOpen: true,
        message: statusInfo.msg,
        type:
          statusInfo.status === 200 ||
          statusInfo.status === 201 ||
          statusInfo.status === 202 ||
          statusInfo.status === 203 ||
          statusInfo.status === 204
            ? 'success'
            : 'error',
      });
    }
  }, [statusInfo]);

  const filterParams = queryString.parse(location.search);

  const isNameKey = Object.keys(filterParams).some(item => item === 'fullName');

  const isPhoneKey = Object.keys(filterParams).some(
    item => item === 'phoneNumber'
  );

  const isStatusKey = Object.keys(filterParams).some(item => item === 'status');

  const isPageKey = Object.keys(filterParams).some(item => item === '_page');

  const isLimitKey = Object.keys(filterParams).some(item => item === 'limit');

  const pages = [5, 10, 25];
  const [page, setPage] = useState((Number(filterParams._page) || 0) as number);
  const [rowsPerPage, setRowsPerPage] = useState(
    Number(filterParams.limit) || pages[page]
  );

  const firstParamsQuery: any = useRef(null);

  const [isSearch, setIsSearch] = useState(isNameKey);

  const [isSearchPhone, setIsSearchPhone] = useState(isPhoneKey);

  const [isStatusSelect, setIsStatusSelect] = useState(isStatusKey);

  useEffect(() => {
    firstParamsQuery.current = location.search;
    const queryStringFilter = queryString.parse(firstParamsQuery.current);
    if (!isNameKey && !isPhoneKey && !isStatusKey) {
      setIsSearch(false);
      setIsSearchPhone(false);
      setIsStatusSelect(false);
      history.push(
        `/employees?_page=${queryStringFilter._page || 0}&limit=${rowsPerPage}`
      );
    }
  }, [
    history,
    isNameKey,
    isPhoneKey,
    isStatusKey,
    rowsPerPage,
    page,
    isPageKey,
    isLimitKey,
    location.search,
  ]);

  const [searchName, setSearchName] = useState(
    (filterParams.fullName as string) || ''
  );

  const [searchPhone, setSearchPhone] = useState(
    (filterParams.phoneNumber as string) || ''
  );

  const [statusValue, setStatusValue] = useState(
    Number(filterParams.status) || 0
  );

  const handleSearchNameChange = (e: any) => {
    const { value } = e.target;

    setSearchName(value);
    setPage(0);

    if (!isStatusKey && !isPhoneKey)
      history.push(
        `/employees?fullName=${value}&_page=${0}&limit=${rowsPerPage}`
      );
    else if (isStatusKey && isPhoneKey)
      history.push(
        `/employees?fullName=${value}&phoneNumber=${searchPhone}&status=${statusValue}&_page=${0}&limit=${rowsPerPage}`
      );
    else if (!isStatusKey)
      history.push(
        `/employees?fullName=${value}&phoneNumber=${searchPhone}&_page=${0}&limit=${rowsPerPage}`
      );
    else
      history.push(
        `/employees?fullName=${value}&status=${statusValue}&_page=${0}&limit=${rowsPerPage}`
      );
  };

  const handleSearchPhoneChange = (e: any) => {
    const { value } = e.target;
    setSearchPhone(value);
    setPage(0);
    if (!isStatusKey && !isNameKey)
      history.push(
        `/employees?phoneNumber=${value}&_page=${0}&limit=${rowsPerPage}`
      );
    else if (isStatusKey && isNameKey)
      history.push(
        `/employees?fullName=${searchName}&phoneNumber=${value}&status=${statusValue}&_page=${0}&limit=${rowsPerPage}`
      );
    else if (!isStatusKey)
      history.push(
        `/employees?fullName=${searchName}&phoneNumber=${value}&_page=${0}&limit=${rowsPerPage}`
      );
    else
      history.push(
        `/employees?phoneNumber=${value}&status=${statusValue}&_page=${0}&limit=${rowsPerPage}`
      );
  };

  const handleStatusChange = (e: any) => {
    const { value } = e.target;
    setStatusValue(value);
    setPage(0);
    if (!isPhoneKey && !isNameKey)
      history.push(
        `/employees?status=${value}&_page=${0}&limit=${rowsPerPage}`
      );
    else if (isPhoneKey && isNameKey)
      history.push(
        `/employees?fullName=${searchName}&phoneNumber=${searchPhone}&status=${value}&_page=${0}&limit=${rowsPerPage}`
      );
    else if (!isPhoneKey)
      history.push(
        `/employees?fullName=${searchName}&status=${value}&_page=${0}&limit=${rowsPerPage}`
      );
    else
      history.push(
        `/employees?phoneNumber=${searchPhone}&status=${value}&_page=${0}&limit=${rowsPerPage}`
      );
  };

  const classes = useStyles();
  const [filterFn, setFilterFn] = useState({
    fn: (items: IGetEmployee[]) => {
      return items;
    },
  });

  const [anchorEl, setAnchorEl] = useState(null);

  const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting } =
    useTable(employees, headCells, filterFn);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const paramsNoNameSearch = (
    isStatusKeyI: boolean,
    isPhoneKeyI: boolean,
    searchNameI: string,
    searchPhoneI: string,
    statusValueI: string | number,
    queryPage: any,
    rowsPerPageI: string | number
  ) => {
    if (!isStatusKeyI && !isPhoneKeyI)
      history.push(
        `/employees?fullName=${searchNameI}&_page=${queryPage}&limit=${rowsPerPageI}`
      );
    else if (isStatusKeyI && isPhoneKeyI)
      history.push(
        `/employees?fullName=${searchNameI}&phoneNumber=${searchPhoneI}&status=${statusValueI}&_page=${queryPage}&limit=${rowsPerPageI}`
      );
    else if (!isStatusKeyI)
      history.push(
        `/employees?fullName=${searchNameI}&phoneNumber=${searchPhoneI}&_page=${queryPage}&limit=${rowsPerPageI}`
      );
    else
      history.push(
        `/employees?fullName=${searchNameI}&status=${statusValueI}&_page=${queryPage}&limit=${rowsPerPageI}`
      );
  };

  const paramsNameSearch = (
    isStatusKeyI: boolean,
    isPhoneKeyI: boolean,
    searchNameI: string,
    searchPhoneI: string,
    statusValueI: string | number,
    queryPage: any,
    rowsPerPageI: string | number
  ) => {
    if (!isStatusKeyI && !isPhoneKeyI)
      history.push(`/employees?_page=${queryPage}&limit=${rowsPerPageI}`);
    else if (isStatusKeyI && isPhoneKeyI)
      history.push(
        `/employees?phoneNumber=${searchPhoneI}&status=${statusValueI}&_page=${queryPage}&limit=${rowsPerPageI}`
      );
    else if (!isStatusKeyI)
      history.push(
        `/employees?phoneNumber=${searchPhoneI}&_page=${queryPage}&limit=${rowsPerPageI}`
      );
    else
      history.push(
        `/employees?status=${statusValueI}&_page=${queryPage}&limit=${rowsPerPageI}`
      );
    setSearchName('');
  };

  const handleSearchClose = () => {
    const queryPage = queryString.parse(firstParamsQuery.current)._page;
    if (!isSearch && searchName) {
      paramsNoNameSearch(
        isStatusKey,
        isPhoneKey,
        searchName,
        searchPhone,
        statusValue,
        0,
        rowsPerPage
      );
    }

    if (!isSearch && !searchName) {
      paramsNoNameSearch(
        isStatusKey,
        isPhoneKey,
        searchName,
        searchPhone,
        statusValue,
        queryPage,
        rowsPerPage
      );
    }

    if (isSearch && searchName) {
      paramsNameSearch(
        isStatusKey,
        isPhoneKey,
        searchName,
        searchPhone,
        statusValue,
        0,
        rowsPerPage
      );
    }

    if (isSearch && !searchName) {
      paramsNameSearch(
        isStatusKey,
        isPhoneKey,
        searchName,
        searchPhone,
        statusValue,
        queryPage,
        rowsPerPage
      );
    }

    setAnchorEl(null);
    setIsSearch(!isSearch);
    setPage(0);
  };

  const paramsNoPhoneSearch = (
    isStatusKeyI: boolean,
    isNameKeyI: boolean,
    searchNameI: string,
    searchPhoneI: string,
    statusValueI: string | number,
    queryPage: any,
    rowsPerPageI: string | number
  ) => {
    if (!isStatusKeyI && !isNameKeyI)
      history.push(
        `/employees?phoneNumber=${searchPhoneI}&_page=${queryPage}&limit=${rowsPerPageI}`
      );
    else if (isStatusKeyI && isNameKeyI)
      history.push(
        `/employees?fullName=${searchNameI}&phoneNumber=${searchPhoneI}&status=${statusValueI}&_page=${queryPage}&limit=${rowsPerPageI}`
      );
    else if (!isStatusKeyI)
      history.push(
        `/employees?fullName=${searchNameI}&phoneNumber=${searchPhoneI}&_page=${queryPage}&limit=${rowsPerPageI}`
      );
    else
      history.push(
        `/employees?phoneNumber=${searchPhoneI}&status=${statusValueI}&_page=${queryPage}&limit=${rowsPerPageI}`
      );
  };

  const paramsPhoneSearch = (
    isStatusKeyI: boolean,
    isNameKeyI: boolean,
    searchNameI: string,
    searchPhoneI: string,
    statusValueI: string | number,
    queryPage: any,
    rowsPerPageI: string | number
  ) => {
    if (!isStatusKeyI && !isNameKeyI)
      history.push(`/employees?_page=${queryPage}&limit=${rowsPerPageI}`);
    else if (isStatusKeyI && isNameKeyI)
      history.push(
        `/employees?fullName=${searchNameI}&status=${statusValueI}&_page=${queryPage}&limit=${rowsPerPageI}`
      );
    else if (!isStatusKeyI)
      history.push(
        `/employees?fullName=${searchNameI}&_page=${queryPage}&limit=${rowsPerPageI}`
      );
    else
      history.push(
        `/employees?status=${statusValueI}&_page=${queryPage}&limit=${rowsPerPageI}`
      );
    setSearchPhone('');
  };

  const handleSearchPhoneClose = () => {
    const queryPage = queryString.parse(firstParamsQuery.current)._page;
    if (!isSearchPhone && searchPhone) {
      paramsNoPhoneSearch(
        isStatusKey,
        isNameKey,
        searchName,
        searchPhone,
        statusValue,
        0,
        rowsPerPage
      );
    }

    if (!isSearchPhone && !searchPhone) {
      paramsNoPhoneSearch(
        isStatusKey,
        isNameKey,
        searchName,
        searchPhone,
        statusValue,
        queryPage,
        rowsPerPage
      );
    }

    if (isSearchPhone && searchPhone) {
      paramsPhoneSearch(
        isStatusKey,
        isNameKey,
        searchName,
        searchPhone,
        statusValue,
        0,
        rowsPerPage
      );
    }

    if (isSearchPhone && !searchPhone) {
      paramsPhoneSearch(
        isStatusKey,
        isNameKey,
        searchName,
        searchPhone,
        statusValue,
        queryPage,
        rowsPerPage
      );
    }

    setAnchorEl(null);
    setIsSearchPhone(!isSearchPhone);
    setPage(0);
  };

  const paramsNoStatusValue = (
    isNameKeyI: boolean,
    isPhoneKeyI: boolean,
    searchNameI: string,
    searchPhoneI: string,
    statusValueI: string | number,
    queryPage: any,
    rowsPerPageI: string | number
  ) => {
    if (!isPhoneKeyI && !isNameKeyI)
      history.push(
        `/employees?status=${statusValueI}&_page=${queryPage}&limit=${rowsPerPageI}`
      );
    else if (isPhoneKeyI && isNameKeyI)
      history.push(
        `/employees?fullName=${searchNameI}&phoneNumber=${searchPhoneI}&status=${statusValueI}&_page=${queryPage}&limit=${rowsPerPageI}`
      );
    else if (!isPhoneKeyI)
      history.push(
        `/employees?fullName=${searchNameI}&status=${statusValueI}&_page=${queryPage}&limit=${rowsPerPageI}`
      );
    else
      history.push(
        `/employees?phoneNumber=${searchPhoneI}&status=${statusValueI}&_page=${queryPage}&limit=${rowsPerPageI}`
      );
  };

  const paramsStatusValue = (
    isNameKeyI: boolean,
    isPhoneKeyI: boolean,
    searchNameI: string,
    searchPhoneI: string,
    statusValueI: string | number,
    queryPage: any,
    rowsPerPageI: string | number
  ) => {
    if (!isPhoneKeyI && !isNameKeyI)
      history.push(`/employees?_page=${queryPage}&limit=${rowsPerPageI}`);
    else if (isPhoneKeyI && isNameKeyI)
      history.push(
        `/employees?fullName=${searchNameI}&phoneNumber=${searchPhoneI}&_page=${queryPage}&limit=${rowsPerPageI}`
      );
    else if (!isPhoneKeyI)
      history.push(
        `/employees?fullName=${searchNameI}&_page=${queryPage}&limit=${rowsPerPageI}`
      );
    else
      history.push(
        `/employees?phoneNumber=${searchPhoneI}&_page=${queryPage}&limit=${rowsPerPageI}`
      );
    setStatusValue(0);
  };

  const handleStatusClose = () => {
    const queryPage = queryString.parse(firstParamsQuery.current)._page;
    if (!isStatusSelect && Number(statusValue)) {
      paramsNoStatusValue(
        isNameKey,
        isPhoneKey,
        searchName,
        searchPhone,
        statusValue,
        0,
        rowsPerPage
      );
    }

    if (!isStatusSelect && !Number(statusValue)) {
      paramsNoStatusValue(
        isNameKey,
        isPhoneKey,
        searchName,
        searchPhone,
        statusValue,
        0,
        rowsPerPage
      );
    }

    if (isStatusSelect && Number(statusValue)) {
      paramsStatusValue(
        isNameKey,
        isPhoneKey,
        searchName,
        searchPhone,
        statusValue,
        0,
        rowsPerPage
      );
    }

    if (isStatusSelect && !Number(statusValue)) {
      paramsStatusValue(
        isNameKey,
        isPhoneKey,
        searchName,
        searchPhone,
        statusValue,
        0,
        rowsPerPage
      );
    }

    setAnchorEl(null);
    setIsStatusSelect(!isStatusSelect);
    setPage(0);
  };

  const handleChangePage = (event: any, newPage: any) => {
    if (isPhoneKey && isNameKey && isStatusKey)
      history.push(
        `/employees?fullName=${searchName}&phoneNumber=${searchPhone}&status=${statusValue}&_page=${newPage}&limit=${rowsPerPage}`
      );
    else if (!isStatusKey && isPhoneKey && isNameKey)
      history.push(
        `/employees?fullName=${searchName}&phoneNumber=${searchPhone}&_page=${newPage}&limit=${rowsPerPage}`
      );
    else if (isStatusKey && isPhoneKey && !isNameKey)
      history.push(
        `/employees?phoneNumber=${searchPhone}&status=${statusValue}&_page=${newPage}&limit=${rowsPerPage}`
      );
    else if (isStatusKey && !isPhoneKey && isNameKey)
      history.push(
        `/employees?fullName=${searchName}&status=${statusValue}&_page=${newPage}&limit=${rowsPerPage}`
      );
    else if (!isStatusKey && isPhoneKey && !isNameKey)
      history.push(
        `/employees?phoneNumber=${searchPhone}&_page=${newPage}&limit=${rowsPerPage}`
      );
    else if (isStatusKey && !isPhoneKey && !isNameKey)
      history.push(
        `/employees?status=${statusValue}&_page=${newPage}&limit=${rowsPerPage}`
      );
    else if (!isStatusKey && !isPhoneKey && isNameKey)
      history.push(
        `/employees?fullName=${searchName}&_page=${newPage}&limit=${rowsPerPage}`
      );
    else history.push(`/employees?_page=${newPage}&limit=${rowsPerPage}`);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    const { value } = event.target;
    if (isPhoneKey && isNameKey && isStatusKey)
      history.push(
        `/employees?fullName=${searchName}&phoneNumber=${searchPhone}&status=${statusValue}&_page=${0}&limit=${value}`
      );
    else if (!isStatusKey && isPhoneKey && isNameKey)
      history.push(
        `/employees?fullName=${searchName}&phoneNumber=${searchPhone}&_page=${0}&limit=${value}`
      );
    else if (isStatusKey && isPhoneKey && !isNameKey)
      history.push(
        `/employees?phoneNumber=${searchPhone}&status=${statusValue}&_page=${0}&limit=${value}`
      );
    else if (isStatusKey && !isPhoneKey && isNameKey)
      history.push(
        `/employees?fullName=${searchName}&status=${statusValue}&_page=${0}&limit=${value}`
      );
    else if (!isStatusKey && isPhoneKey && !isNameKey)
      history.push(
        `/employees?phoneNumber=${searchPhone}&_page=${0}&limit=${value}`
      );
    else if (isStatusKey && !isPhoneKey && !isNameKey)
      history.push(
        `/employees?status=${statusValue}&_page=${0}&limit=${value}`
      );
    else if (!isStatusKey && !isPhoneKey && isNameKey)
      history.push(
        `/employees?fullName=${searchName}&_page=${0}&limit=${value}`
      );
    else history.push(`/employees?_page=${0}&limit=${value}`);
    setRowsPerPage(parseInt(value, 10));
    setPage(0);
  };

  const dispatch = useAppDispatch();

  const delaySearch = useMemo(() => {
    const getEmployeesFilter = () => {
      const queryStringFilter = queryString.parse(firstParamsQuery.current);

      const data = isStatusKey
        ? queryString.stringify({
            ...queryStringFilter,
            _page: Number(queryStringFilter._page) + 1,
            status: !!Number(queryStringFilter.status),
          })
        : queryString.stringify({
            ...queryStringFilter,
            _page: Number(queryStringFilter._page) + 1,
          });

      setTimeout(() => {
        dispatch(getFilterEmployees(data));
      }, 300);
    };
    return _.debounce(getEmployeesFilter, 500);
  }, [dispatch, isStatusKey]);

  useEffect(() => {
    delaySearch();
    return delaySearch.cancel;
  }, [dispatch, delaySearch, searchName, searchPhone, location.search]);

  const handleClickEmployeeDetail = (id: string) => {
    history.push(`/employees/${id}`);
  };

  const queryStringPage = queryString.parse(firstParamsQuery.current)._page;

  const isShowFilterButton = isSearch && isStatusSelect && isSearchPhone;

  return (
    <>
      <Paper className={classes.pageContent}>
        <Typography className={classes.typoHeader} variant="h4" component="h4">
          {t('employees.employees')}
        </Typography>
        <Toolbar
          className={clsx(classes.toolbarAction, classes.actionResponsive)}
        >
          <div
            className={clsx(classes.flexFilterGroup, classes.filterResponsive)}
          >
            {isSearch ? (
              <div className={classes.flexFilterGroup}>
                <IconButton
                  aria-label="delete"
                  className={classes.margin}
                  onClick={handleSearchClose}
                >
                  <HighlightOff />
                </IconButton>

                <Input
                  name="name"
                  label={t('employees.fullName')}
                  value={searchName}
                  error=""
                  className={classes.searchInput}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  onChange={handleSearchNameChange}
                  onBlur={() => {}}
                  type="text"
                  disabled={false}
                />
              </div>
            ) : (
              ''
            )}

            {isSearchPhone ? (
              <div className={classes.flexFilterGroup}>
                <IconButton
                  aria-label="delete"
                  className={classes.margin}
                  onClick={handleSearchPhoneClose}
                >
                  <HighlightOff />
                </IconButton>

                <Input
                  name="name"
                  label={t('employees.phone')}
                  value={searchPhone}
                  error=""
                  className={classes.searchInput}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  onChange={handleSearchPhoneChange}
                  onBlur={() => {}}
                  type="text"
                  disabled={false}
                />
              </div>
            ) : (
              ''
            )}

            {isStatusSelect ? (
              <div className={classes.flexFilterGroup}>
                <IconButton
                  aria-label="delete"
                  className={classes.margin}
                  onClick={handleStatusClose}
                >
                  <HighlightOff />
                </IconButton>

                <Select
                  className={classes.selectInput}
                  label={t('employees.status')}
                  name="status"
                  onChange={handleStatusChange}
                  value={statusValue}
                  options={statusEmployee}
                  error={undefined}
                />
              </div>
            ) : (
              ''
            )}
          </div>
          <div className={classes.filterButton}>
            {isShowFilterButton ? (
              ''
            ) : (
              <Button
                text={t('employees.filter')}
                type="button"
                variant="contained"
                size="large"
                color="primary"
                startIcon={<FilterIcon />}
                className={classes.buttonResp}
                onClick={handleClick}
              />
            )}

            <Button
              text={t('employees.add')}
              startIcon={<AddIcon />}
              type="button"
              variant="contained"
              size="large"
              color="primary"
              className={clsx(classes.newButton, classes.buttonResp)}
              onClick={() => {
                history.push('/employees/create');
              }}
            />
          </div>
        </Toolbar>
        {isLoading ? (
          <>
            <Typography component="div" variant="h3">
              <Skeleton animation="wave" />
            </Typography>
            <Typography component="div" variant="h3">
              <Skeleton animation="wave" />
            </Typography>
            <Typography component="div" variant="h3">
              <Skeleton animation="wave" />
            </Typography>
            <Typography component="div" variant="h3">
              <Skeleton animation="wave" />
            </Typography>
            <Typography component="div" variant="h3">
              <Skeleton animation="wave" />
            </Typography>
            <Typography component="div" variant="h3">
              <Skeleton animation="wave" />
            </Typography>
            <Skeleton
              animation="wave"
              height={25}
              width="50%"
              style={{ marginLeft: '50%' }}
            />
          </>
        ) : (
          <>
            <TblContainer>
              <TblHead />
              <TableBody>
                {employees.map((item: IGetEmployee, ind: number) => {
                  const gender = () => {
                    if (!item.gender) return t('employees.male');
                    if (item.gender === 1) return t('employees.female');
                    return t('employees.others');
                  };
                  return (
                    <TableRow
                      onClick={() => handleClickEmployeeDetail(item._id)}
                      key={item._id}
                    >
                      <TableCell>{ind + 1}</TableCell>
                      <TableCell>
                        {item.fullName || `${item.lastName} ${item.firstName}`}
                      </TableCell>
                      <TableCell>
                        {moment(item.birthDay).format('DD/MM/YYYY')}
                      </TableCell>
                      <TableCell>{gender()}</TableCell>
                      <TableCell
                        className={
                          item.status
                            ? classes.colorActive
                            : classes.colorInActive
                        }
                      >
                        {item.status
                          ? t('employees.active')
                          : t('employees.inActive')}
                      </TableCell>
                      <TableCell>{item.phoneNumber}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </TblContainer>
            {totalEmployees ? (
              <TblPagination
                page={Number(queryStringPage)}
                pages={pages}
                rowsPerPage={rowsPerPage}
                count={totalEmployees}
                handleChangePage={handleChangePage}
                handleChangeRowsPerPage={handleChangeRowsPerPage}
              />
            ) : (
              ''
            )}
          </>
        )}
      </Paper>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {isSearch ? (
          ''
        ) : (
          <MenuItem onClick={handleSearchClose}>{t('employees.name')}</MenuItem>
        )}

        {isSearchPhone ? (
          ''
        ) : (
          <MenuItem onClick={handleSearchPhoneClose}>
            {t('employees.phone')}
          </MenuItem>
        )}

        {isStatusSelect ? (
          ''
        ) : (
          <MenuItem onClick={handleStatusClose}>
            {t('employees.status')}
          </MenuItem>
        )}
      </Menu>
      <Notification notify={notify} setNotify={setNotify} />
    </>
  );
};

export default Employees;
