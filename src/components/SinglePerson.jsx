import React, { useState } from "react";
import ViewMemberDetails from "./ViewMemberDetails";

const SinglePerson = ({ setAddMember }) => {
  const [members, setMembers] = useState([]);
  const [memberName, setMemberName] = useState('');
  const [inputDepositBalance, setInputDepositBalance] = useState(0);
  const [inputMealNumber, setInputMealNumber] = useState(0);
  const [byPassTotalBalance, setByPassTotalBalance]= useState(0);

  const handleCancelAddMember = () => {
    setAddMember(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (memberName.trim() === '' || inputDepositBalance <= 0 || inputMealNumber <= 0) {
      alert("Please fill in all fields correctly.");
      return;
    }

    // Create a new member object
    const newMember = {
      name: memberName,
      depositBalance: parseFloat(inputDepositBalance),
      totalMeals: parseInt(inputMealNumber), 
      individualAmount: parseFloat(inputDepositBalance)
    };

    const updatedMembers = [...members, newMember];

    // Calculate total deposit balance and total meals
    const totalDepositBalance = updatedMembers.reduce((sum, member) => sum + member.depositBalance, 0);
    const totalMeals = updatedMembers.reduce((sum, member) => sum + member.totalMeals, 0);

    //By pass total deposit balance for all members
    setByPassTotalBalance(totalDepositBalance);

    const averageMealRate = totalMeals > 0 ? totalDepositBalance / totalMeals : 0;

    // Update all members 
    const finalMembers = updatedMembers.map(member => ({
      ...member,
      averageMealRate: averageMealRate,
      individualAmount: member.depositBalance - (averageMealRate * member.totalMeals)
    }));

    // Update state with the final list of members
    setMembers(finalMembers);

    // Reset input fields after submission
    setMemberName('');
    setInputDepositBalance(0);
    setInputMealNumber(0);
  };

  //const totalAmount = members.reduce((sum, member) => sum + member.individualAmount, 0);

  return (
    <div className="w-[80%] mt-12 sm:w-[50%] bg-red-200 p-1 sm:p-4 mx-auto rounded-sm">
      <form onSubmit={handleSubmit}>
        <h1 className="text-center text-lg sm:text-xl font-semibold">Mess Meal Manager App</h1>
        
        <div className="mt-4">
          <label>Name</label>
          <br />
          <input
            value={memberName}
            onChange={(e) => setMemberName(e.target.value)}
            className="px-1 py-2 rounded-sm w-full"
            type="text"
            required
            placeholder="Enter Mess Member Name"
          />
        </div>

        <div className="mt-4">
          <label>Deposit Balance</label>
          <br />
          <input
            value={inputDepositBalance}
            onChange={(e) => setInputDepositBalance(e.target.value)}
            className="px-1 py-2 rounded-sm w-full"
            type="number"
            required
            placeholder="Enter Deposit Balance"
          />
        </div>

        <div className="mt-4">
          <label>Total Meals</label>
          <br />
          <input
            value={inputMealNumber}
            onChange={(e) => setInputMealNumber(e.target.value)}
            className="px-1 py-2 rounded-sm w-full"
            type="number"
            required
            placeholder="Enter Total Meals"
          />
        </div>

        <div className="w-full text-center mt-4">
          <button type="submit" className="bg-rose-500 w-full hover:bg-rose-400 text-white px-4 rounded-sm uppercase py-1">
            Add
          </button>
        </div>
      </form>
      <ViewMemberDetails members={members} byPassTotalBalance={byPassTotalBalance} />
      <div>
        <h3 className="text-center py-2 text-slate-600 text-xs sm:mt-4 sm:text-base">Connect with <span className="italic">@SumonRoy</span></h3>
      </div>
    </div>
  );
};

export default SinglePerson;