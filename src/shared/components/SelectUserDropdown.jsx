
import React, { useState, useEffect } from 'react';
// Supabase removido - migrado a MySQL
import { Select } from '@shared/components/ui/select';
import { Label } from '@shared/components/ui/label';
import { toast } from '@shared/components/ui/use-toast';

const SelectUserDropdown = ({ role, onSelectUser, currentAssignedUserId, label, placeholder = "Seleccionar usuario" }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedValue, setSelectedValue] = useState(currentAssignedUserId || "");

  useEffect(() => {
    const fetchUsers = async () => {
      // TODO: Implementar con MySQL
      setLoading(true);
      setUsers([]);
      setLoading(false);
    };

    if (role) {
      fetchUsers();
    }
  }, [role]);

  useEffect(() => {
    setSelectedValue(currentAssignedUserId || "");
  }, [currentAssignedUserId]);

  const handleChange = (event) => {
    const userId = event.target.value;
    setSelectedValue(userId);
    if (onSelectUser) {
      onSelectUser(userId === "" ? null : userId);
    }
  };

  return (
    <div>
      {label && <Label htmlFor={`select-${role}`}>{label}</Label>}
      <Select
        id={`select-${role}`}
        value={selectedValue}
        onChange={handleChange}
        disabled={loading || users.length === 0}
      >
        <option value="">{loading ? `Cargando ${role}s...` : (users.length === 0 ? `No hay ${role}s disponibles` : placeholder)}</option>
        {users.map((user) => (
          <option key={user.user_id} value={user.user_id}>
            {user.username || user.email}
          </option>
        ))}
      </Select>
    </div>
  );
};

export default SelectUserDropdown;
