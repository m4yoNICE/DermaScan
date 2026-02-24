import React, { useState, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Table from '@/components/Table';
import SearchBar from '@/components/SearchBar';
import { fetchOutOfScopeData } from '@/redux/slices/outofscopeSlice';

const OutOfScopePage = () => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: outOfScope, loading, error } = useSelector(
    (state) => state.outOfScope
  );

  useEffect(() => {
    dispatch(fetchOutOfScopeData());
  }, [dispatch]);

  const filteredData = useMemo(() => {
    if (!searchQuery) return outOfScope;
    return outOfScope.filter((item) =>
      item.conditionName?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, outOfScope]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Out of Scope Conditions</h1>

      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search condition..."
        className="max-w-md mb-6"
      />

      {loading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin h-12 w-12 border-b-2 border-[#00CC99] rounded-full"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {!loading && !error && (
        <Table
          data={filteredData}
          columns={[
            { key: 'id', label: 'ID', width: '80px' },
            {
              key: 'conditionName',
              label: 'Condition Name',
              width: '200px',
              render: (value) => <span className="capitalize">{value}</span>,
            },
            {
              key: 'canRecommend',
              label: 'Can Recommend?',
              width: '150px',
              render: (value) => (
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    value === 'No'
                      ? 'bg-red-100 text-red-600'
                      : 'bg-green-100 text-green-600'
                  }`}
                >
                  {value}
                </span>
              ),
            },
          ]}
          itemsPerPage={10}
        />
      )}
    </div>
  );
};

export default OutOfScopePage;