export function StakingForm(props) {
  const registerUser = async (event) => {
    event.preventDefault();
    const amount = event.target.amount.value;
    event.target.amount.value = "";
    console.log("Stake", amount);
  };

  return (
    <form onSubmit={registerUser}>
      <label htmlFor="amount">Amount</label>
      <input
        id={props.id}
        name="amount"
        type="number"
        autoComplete="amount"
        required
      />
      <button type="submit">Stake</button>
    </form>
  );
}
