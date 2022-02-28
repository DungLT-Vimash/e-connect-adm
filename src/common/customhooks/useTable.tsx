import { ReactNode, useState } from 'react';
import clsx from 'clsx';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  makeStyles,
  TablePagination,
  TableSortLabel,
  TableContainer,
  Paper,
  SortDirection,
} from '@material-ui/core';

const useStyles = makeStyles(theme => {
  const isDarkMode = localStorage.getItem('darkMode');
  return {
    table: {
      minWidth: 650,
      '& thead th': {
        fontWeight: '800',
        fontSize: '1rem',
        color: isDarkMode === 'true' ? '#fff' : '#333996',
        backgroundColor: isDarkMode === 'true' ? '#303030' : '#3c44b126',
      },
      '& tbody td': {
        fontWeight: '500',
      },
      '& tbody tr:hover': {
        backgroundColor: isDarkMode === 'true' ? '#303030' : '#fffbf2',
        cursor: 'pointer',
      },
    },
    responsive: {
      [theme.breakpoints.down('sm')]: {},
    },
  };
});

interface IProps {
  children: ReactNode;
}

export default function useTable(records: any, headCells: any, filterFn: any) {
  const classes = useStyles();
  const [order, setOrder] = useState<'desc' | 'asc'>();
  const [orderBy, setOrderBy] = useState();

  const TblContainer = ({ children }: IProps) => (
    <TableContainer component={Paper}>
      <Table
        className={clsx(classes.table, classes.responsive)}
        aria-label="custom pagination table"
      >
        {children}
      </Table>
    </TableContainer>
  );

  const TblHead = (props: any) => {
    const handleSortRequest = (cellId: any) => {
      const isAsc = orderBy === cellId && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(cellId);
    };

    return (
      <TableHead>
        <TableRow>
          {headCells.map((headCell: any) => (
            <TableCell
              key={headCell.id}
              sortDirection={
                (orderBy === headCell.id ? order : false) as SortDirection
              }
            >
              {headCell.disableSorting ? (
                headCell.label
              ) : (
                <TableSortLabel
                  active={orderBy === headCell.id}
                  direction={
                    (orderBy === headCell.id ? order : 'asc') as 'asc' | 'desc'
                  }
                  onClick={() => {
                    handleSortRequest(headCell.id);
                  }}
                >
                  {headCell.label}
                </TableSortLabel>
              )}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  };

  const TblPagination = ({
    page,
    pages,
    rowsPerPage,
    count,
    handleChangePage,
    handleChangeRowsPerPage,
  }: any) => {
    return (
      <TablePagination
        component="div"
        page={page}
        rowsPerPageOptions={pages}
        rowsPerPage={rowsPerPage}
        count={count}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    );
  };

  function stableSort(array: any, comparator: any) {
    const stabilizedThis = array.map((el: any, index: any) => [el, index]);
    stabilizedThis.sort((a: any, b: any) => {
      const orderComparator = comparator(a[0], b[0]);
      if (orderComparator !== 0) return orderComparator;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el: any) => el[0]);
  }

  function descendingComparator(a: any, b: any, orderDescComBy: any) {
    if (b[orderDescComBy] < a[orderDescComBy]) {
      return -1;
    }
    if (b[orderDescComBy] > a[orderDescComBy]) {
      return 1;
    }
    return 0;
  }

  function getComparator(orderCom: any, orderComBy: any) {
    return orderCom === 'desc'
      ? (a: any, b: any) => descendingComparator(a, b, orderComBy)
      : (a: any, b: any) => -descendingComparator(a, b, orderComBy);
  }

  const recordsAfterPagingAndSorting = () => {
    return stableSort(filterFn.fn(records), getComparator(order, orderBy));
  };

  return {
    TblContainer,
    TblHead,
    TblPagination,
    recordsAfterPagingAndSorting,
  };
}
