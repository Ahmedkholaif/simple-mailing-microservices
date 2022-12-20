import * as React from "react";
import { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';

import * as mailService from "../apis/mails";
import { Container } from "@mui/material";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function Home() {
  const [isLoading, setLoading] = useState(true);
  const [allEmails, setAllEmails] = useState<any>([]);
  const [formData, setFormData] = useState<any>({});
  const [mailIntervals, setMailIntervals] = useState<any>([]);

  const updateEmailStatus = async (
    id: number,
    clearIntervalCb: { (): void; (): void }
  ) => {
    const mail: any = await mailService.getOneStatus(id);
    if (!mail) {
      const intId = clearIntervalCb();
      setMailIntervals((oldInt: any[]) =>
        oldInt.filter((id: void) => id !== intId)
      );
      return;
    }
    setAllEmails((oldMails: any[]) => [
      mail,
      ...oldMails.filter((em: any) => em.id !== id),
    ]);

    if (mail.status === "Succeeded") {
      const intId = clearIntervalCb();
      setMailIntervals((oldInt: any[]) =>
        oldInt.filter((id: void) => id !== intId)
      );
    }
  };

  const fetchData = async () => {
    const data: any = await mailService.getAll();
    if (!data) return;
    const pendingMails = data.filter((em: any) => em.status !== "Succeeded");

    const intervals = pendingMails.map((mail: any) => {
      const intervalId = setInterval(() => {
        updateEmailStatus(mail.id, () => {
          clearInterval(intervalId);
          return intervalId;
        });
      }, 2000);
      return intervalId;
    });

    setAllEmails(data);
    setMailIntervals(intervals);
  };
  useEffect(() => {
    // get all emails
    // setInterval for updates

    fetchData();
    setLoading(false);
    return () => {
      mailIntervals.forEach(
        (intervalId: string | number | NodeJS.Timeout | undefined) => {
          clearInterval(intervalId);
        }
      );
    };
  }, []);

  const handleChange = (e: any) => {
    const {
      name,
      value,
      validity: { valid },
    } = e.target;

    setFormData({ ...formData, [name]: valid ? value : undefined });
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    await mailService.createNew({
      email: formData.email,
      totalCount: +formData.count,
    });
    fetchData();
  };

  return (
    <Container maxWidth="xl">
      <Box
        component="form"
        sx={{
          "& > :not(style)": { m: 1, width: "25ch" },
        }}
        autoComplete="off"
      >
        <TextField
          onChange={handleChange}
          id="email"
          name="email"
          label="Email"
          type="email"
          // variant="outlined"
          variant="standard"
        />
        <TextField
          onChange={handleChange}
          id="count"
          name="count"
          label="Sending Count"
          type="number"
          variant="standard"
          // variant="outlined"
        />
      </Box>
      <Button
        sx={{ margin: "15px auto" }}
        onClick={handleSubmit}
        disabled={!(formData.email && formData.count)}
        variant="contained"
      >
        Send Emails  <SendOutlinedIcon/>
      </Button>

      {isLoading ? (
        <Box sx={{ margin: "auto" }}>Loading...</Box>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell> Email (ID)</StyledTableCell>
                <StyledTableCell align="right">Total Count</StyledTableCell>
                <StyledTableCell align="right">Sent Count</StyledTableCell>
                <StyledTableCell align="right">Status</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allEmails
                .sort((a: any, b: any) => {
                  return b.id - a.id;
                })
                .map((mail: any) => (
                  <StyledTableRow
                    key={mail.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <StyledTableCell component="th" scope="row">
                      {mail.email} ({mail.id})
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {mail.totalCount}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {mail.sentCount}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {mail.status}
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}
