import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Button, Container, Grid, TextField } from '@mui/material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { DatePicker } from '@mui/x-date-pickers';
import IncomeCard from '../sections/@dashboard/incomeData/IncomeCard';
import { totalIncome } from '../components/income-data/TotalIncome';
import { IncomeContext } from '../context/IncomeProvider';

export default function Types() {
  const [category, setCategory] = React.useState('');
  const [date, setDate] = React.useState('');
  const [incomes, setIncomes] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const name = React.useContext(IncomeContext);

  console.log(name);
  const handleChange = (event) => {
    setCategory(event.target.value);
  };
  const handleIncome = (e) => {
    e.preventDefault();
    const form = e.target;
    const source = form.source.value;
    const amount = form.amount.value;
    const category = form.category.value;
    const reference = form.reference.value;
    const incomeData = {
      source,
      amount,
      date,
      time: new Date(),
      category,
      reference,
    };
    console.log(incomeData);
    // data store in database
    fetch('http://localhost:5000/incomes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(incomeData),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data?.data) {
          form.reset();
          setLoading(!loading);
          setDate('');
          setCategory('');
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  React.useEffect(() => {
    fetch('http://localhost:5000/incomes')
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setIncomes(data.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [loading]);
  const totalIncomeAmount = totalIncome(incomes);

  return (
    <Container>
      <Box sx={{ width: '100%' }}>
        <Typography variant="h3" gutterBottom>
          Incomes
        </Typography>
      </Box>
      <Box
        textAlign="center"
        sx={{ width: '100%', p: 2, backgroundColor: 'rgba(145, 158, 171, 0.12)', borderRadius: '9px' }}
      >
        <Typography variant="h5" gutterBottom>
          Total Income : ${totalIncomeAmount}
        </Typography>
      </Box>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{ my: 1 }}>
        <Grid item xs={6}>
          <Box component="form" onSubmit={handleIncome}>
            <TextField name="source" fullWidth id="demo-helper-text-aligned-no-helper" label="Income source" required />
            <TextField
              name="amount"
              sx={{ mt: '10px' }}
              fullWidth
              id="demo-helper-text-aligned-no-helper"
              label="Amount"
              required
            />
            {/* data & time  */}
            <LocalizationProvider dateAdapter={AdapterDayjs} sx={{ mt: '10px', width: '100%' }}>
              <DemoContainer fullWidth components={['DatePicker']}>
                <DatePicker onChange={(e) => setDate(e.$d)} fullWidth label="Date" sx={{ width: '100%' }} />
              </DemoContainer>
            </LocalizationProvider>
            {/* Reference  */}
            <FormControl fullWidth sx={{ my: '10px' }} required>
              <InputLabel id="demo-simple-select-label">Category</InputLabel>
              <Select
                name="category"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={category}
                label="Category"
                onChange={handleChange}
              >
                <MenuItem value={'salary'}>Salary</MenuItem>
                <MenuItem value={'investments'}>Investments</MenuItem>
                <MenuItem value={'business'}>Business</MenuItem>
                <MenuItem value={'freelancing'}>Freelancing</MenuItem>
                <MenuItem value={'youtube'}>Youtube</MenuItem>
                <MenuItem value={'facebook'}>Facebook</MenuItem>
                <MenuItem value={'others'}>Others</MenuItem>
              </Select>
            </FormControl>
            <TextField
              minRows={4}
              name="reference"
              fullWidth
              id="outlined-textarea"
              label="Reference"
              placeholder="Add a reference"
              multiline
              required
            />
            <Button type="submit" variant="contained" sx={{ my: '10px', px: 4, py: 1 }}>
              Add income
            </Button>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box sx={{ width: '100%' }}>
            <Typography variant="h4" textAlign="center">
              History
            </Typography>
          </Box>
          <Grid container spacing={2}>
            {incomes.map((income) => (
              <IncomeCard key={income._id} income={income} loading={loading} setLoading={setLoading} path="incomes" />
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}
