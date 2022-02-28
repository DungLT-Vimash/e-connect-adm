import { useHistory, useLocation } from 'react-router-dom';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import { DateRangePicker } from 'react-dates';
import { useEffect, useState } from 'react';
import {
  makeStyles,
  Paper,
  TableBody,
  TableCell,
  TableFooter,
  TablePagination,
  TableRow,
  Toolbar,
  Typography,
} from '@material-ui/core';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import useTable from '../../../../common/customhooks/useTable';
import { getAgendas } from './agendaSlice';

const useStyles = makeStyles(theme => ({
  pageContent: {
    margin: theme.spacing(1),
    padding: theme.spacing(3),
  },
  colorActive: {
    color: '#00CC00	',
  },
  colorInActive: {
    color: '#FF0000',
  },
  typeHeader: {
    marginBottom: theme.spacing(2),
  },
  headerTitle: {
    display: 'flex',
    alignItems: 'center',
    margin: 'auto',
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: '#e4e7e7',
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: 'auto',
    height: '100%',
    [theme.breakpoints.down('sm')]: {
      marginBottom: theme.spacing(3),
      marginTop: theme.spacing(3),
      marginRight: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'black',
  },
  inputRoot: {
    color: 'black',
    width: '100%',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
  },
  dateRange: {},
  toolBarHeader: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
    justifyContent: 'space-between',
  },
}));

const Employees = () => {
  const history = useHistory();
  const path = useLocation();

  const s = path.search;
  const params = new URLSearchParams(s);

  const [start, setStart] = useState(
    params.get('startDate') !== null ? moment(params.get('startDate')) : null
  );
  const [end, setEnd] = useState(
    params.get('endDate') !== null ? moment(params.get('endDate')) : null
  );
  const [focusedInput, setFocusedInput] = useState<any>(null);

  const [page, setPage] = useState((Number(params.get('page')) || 0) as number);
  const [rowsPerPage, setRowsPerPage] = useState(
    (Number(params.get('row')) || 5) as number
  );

  const [search, setSearch] = useState((params.get('name') as string) || '');
  const agenda = useAppSelector(states => states.agenda.agenda);
  const countTotal = useAppSelector(states => states.agenda.total);

  const pages = [5, 10, 15];

  const classes = useStyles();
  const { t } = useTranslation();

  const location = (
    name: any,
    rowTable: any,
    pageTable: any,
    endDate: any,
    startDate: any
  ) => {
    if (name !== '' && startDate === null && endDate === null) {
      history.push(`/agenda?name=${name}&page=${pageTable}&row=${rowTable}`);
    }
    if (name === '' && startDate !== null && endDate !== null) {
      history.push(
        `/agenda?startDate=${moment(startDate).toISOString()}&endDate=${moment(
          endDate
        ).toISOString()}&page=${pageTable}&row=${rowTable}`
      );
    }
    if (name !== '' && startDate !== null && endDate !== null) {
      history.push(
        `/agenda?name=${name}&startDate=${moment(
          startDate
        ).toISOString()}&endDate=${moment(
          endDate
        ).toISOString()}&page=${pageTable}&row=${rowTable}`
      );
    }
    if (name === '' && startDate === null && endDate === null) {
      history.push(`/agenda?page=${pageTable}&row=${rowTable}`);
    }
  };

  const headCells = [
    { id: 'fullName', label: t('agenda.fullName'), disableSorting: true },
    { id: 'dateCreated', label: t('agenda.dateCreated'), disableSorting: true },
    { id: 'status', label: t('agenda.status'), disableSorting: true },
    { id: 'reason', label: t('agenda.reason'), disableSorting: true },
    { id: 'startDate', label: t('agenda.startDate'), disableSorting: true },
    { id: 'dayOff', label: t('agenda.dayOff'), disableSorting: true },
  ];

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getAgendas({ page, rowsPerPage, search, start, end }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, page, rowsPerPage]);

  const [filterFn, setFilterFn] = useState({
    fn: (items: any) => {
      return items;
    },
  });

  const { TblContainer, TblHead } = useTable(agenda, headCells, filterFn);

  const onclick = (id: any) => {
    history.push(`/agenda/${id}`);
  };

  const onChange = (event: any) => {
    const nameSearch = event.target.value;
    setSearch(nameSearch);
    setPage(0);
    setRowsPerPage(5);
    location(nameSearch, rowsPerPage, page, end, start);
    const debounceSearch = _.debounce(() => {
      dispatch(
        getAgendas({ page: 0, rowsPerPage: 5, search: nameSearch, start, end })
      );
    }, 500);
    debounceSearch();
  };

  const onChangeDate = (startDate: any, endDate: any) => {
    setStart(startDate);
    setEnd(endDate);
    setPage(0);
    setRowsPerPage(5);
    location(
      search,
      rowsPerPage,
      page,
      moment(endDate).toISOString(),
      moment(startDate).toISOString()
    );
    dispatch(
      getAgendas({
        page: 0,
        rowsPerPage: 5,
        search,
        start: startDate,
        end: endDate,
      })
    );
  };

  const handleChangePage = (event: any, newPage: number) => {
    setPage(newPage);
    location(search, rowsPerPage, newPage, end, start);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    location(search, rowsPerPage, parseInt(event.target.value, 10), end, start);
  };

  return (
    <div>
      <Paper className={classes.pageContent}>
        <Typography className={classes.typeHeader} variant="h4" component="h4">
          {t('agenda.agenda')}
        </Typography>
        <Toolbar>
          <div className={classes.toolBarHeader}>
            <div className={classes.dateRange}>
              <DateRangePicker
                startDateId="startDate"
                endDateId="endDate"
                startDate={start}
                endDate={end}
                onDatesChange={({ startDate, endDate }) =>
                  onChangeDate(startDate, endDate)
                }
                focusedInput={focusedInput}
                onFocusChange={focused => {
                  setFocusedInput(focused);
                }}
                isOutsideRange={() => false}
                small
                showClearDates
              />
            </div>
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                value={search}
                placeholder={t('agenda.search') as string}
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                inputProps={{ 'aria-label': 'search' }}
                onChange={onChange}
              />
            </div>
          </div>
        </Toolbar>
        <TblContainer>
          <TblHead />
          <TableBody>
            {agenda.map((item: any, ind: number) => (
              // eslint-disable-next-line no-underscore-dangle
              <TableRow key={item._id} onClick={() => onclick(item._id)}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{moment(item.createdAt).format('L')}</TableCell>
                <TableCell
                  className={
                    item.status ? classes.colorActive : classes.colorInActive
                  }
                >
                  {item.status ? t('agenda.viewed') : t('agenda.requaested')}
                </TableCell>
                <TableCell>{item.reason}</TableCell>
                <TableCell>{moment(item.startDate).format('L')}</TableCell>
                <TableCell>{item.dayoff}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={pages}
                count={countTotal}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
              />
            </TableRow>
          </TableFooter>
        </TblContainer>
      </Paper>
    </div>
  );
};

export default Employees;
