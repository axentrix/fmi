import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Lock, ExternalLink, Unlock } from 'lucide-react';
import type { Community, UserTier } from '../types/dashboard';

interface DataTableProps {
  communities: Community[];
  userTier: UserTier;
  onUnlock: (communityId: string) => void;
  onSort: (column: string) => void;
  sortColumn: string;
  sortDirection: 'asc' | 'desc';
}

const DataTable: React.FC<DataTableProps> = ({
  communities,
  userTier,
  onUnlock,
  onSort,
  sortColumn,
  sortDirection
}) => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PRIME': return 'bg-green-100 text-green-800';
      case 'RECENT': return 'bg-blue-100 text-blue-800';
      case 'AGED': return 'bg-yellow-100 text-yellow-800';
      case 'ARCHIVED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const SortIcon = ({ column }: { column: string }) => {
    if (sortColumn !== column) return null;
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="overflow-x-auto">
        <table className="w-full text-xs sm:text-sm">
                     <thead className="bg-gray-50 border-b border-gray-200">
             <tr>
               <th className="px-4 py-3 text-left font-medium text-gray-500 text-xs w-8" style={{ fontSize: '12px', color: '#6b7280' }}></th>
               <th 
                 className="px-4 py-3 text-left font-medium text-gray-500 text-xs cursor-pointer hover:bg-gray-100"
                 onClick={() => onSort('builder')}
                 style={{ fontSize: '12px', color: '#6b7280' }}
               >
                 Builder {sortColumn === 'builder' && <SortIcon column="builder" />}
               </th>
               <th 
                 className="px-4 py-3 text-left font-medium text-gray-500 text-xs cursor-pointer hover:bg-gray-100"
                 onClick={() => onSort('community')}
                 style={{ fontSize: '12px', color: '#6b7280' }}
               >
                 Community / Location {sortColumn === 'community' && <SortIcon column="community" />}
               </th>
               <th 
                 className="px-4 py-3 text-left font-medium text-gray-500 text-xs cursor-pointer hover:bg-gray-100"
                 onClick={() => onSort('homes')}
                 style={{ fontSize: '12px', color: '#6b7280' }}
               >
                 Homes {sortColumn === 'homes' && <SortIcon column="homes" />}
               </th>
               <th 
                 className="px-4 py-3 text-left font-medium text-gray-500 text-xs cursor-pointer hover:bg-gray-100"
                 onClick={() => onSort('lotSize')}
                 style={{ fontSize: '12px', color: '#6b7280' }}
               >
                 Lot Size {sortColumn === 'lotSize' && <SortIcon column="lotSize" />}
               </th>
               <th 
                 className="px-4 py-3 text-left font-medium text-gray-500 text-xs cursor-pointer hover:bg-gray-100"
                 onClick={() => onSort('dateAdded')}
                 style={{ fontSize: '12px', color: '#6b7280' }}
               >
                 Date Added {sortColumn === 'dateAdded' && <SortIcon column="dateAdded" />}
               </th>
               <th 
                 className="px-4 py-3 text-left font-medium text-gray-500 text-xs cursor-pointer hover:bg-gray-100"
                 onClick={() => onSort('status')}
                 style={{ fontSize: '12px', color: '#6b7280' }}
               >
                 Status {sortColumn === 'status' && <SortIcon column="status" />}
               </th>
               <th className="px-4 py-3 text-left font-medium text-gray-500 text-xs" style={{ fontSize: '12px', color: '#6b7280' }}>Action</th>
               <th className="px-4 py-3 text-left font-medium text-gray-500 text-xs" style={{ fontSize: '12px', color: '#6b7280' }}>Sitemap</th>
               <th className="px-4 py-3 text-left font-medium text-gray-500 text-xs" style={{ fontSize: '12px', color: '#6b7280' }}>Homes Sold</th>
               <th className="px-4 py-3 text-left font-medium text-gray-500 text-xs" style={{ fontSize: '12px', color: '#6b7280' }}>Avg. Price</th>
             </tr>
           </thead>
          <tbody className="divide-y divide-gray-200">
            {communities.map((community) => (
              <React.Fragment key={community.id}>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleRow(community.id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {expandedRows.has(community.id) ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-start">
                      <img 
                        src={`/fmi/${community.builder.logo}`} 
                        alt={community.builder.name}
                        className="max-w-[180px] h-6 rounded"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-medium">{community.community.name}</div>
                      <div className="text-gray-500 text-xs">
                        {community.community.county}, {community.community.state}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">~{community.homes}</td>
                  <td className="px-4 py-3">~{community.lotSize} ac</td>
                  <td className="px-4 py-3">{community.dateAdded}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(community.status)}`}>
                      {community.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => onUnlock(community.id)}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-blue-700"
                    >
                      Unlock for {community.creditsRequired} Credits
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    {userTier === 'Basic' ? (
                      <div className="flex items-center space-x-1 text-gray-400" title="Upgrade to Pro for access">
                        <Lock size={16} />
                      </div>
                    ) : (
                      <button className="text-blue-600 hover:text-blue-800">
                        <ExternalLink size={16} />
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {userTier === 'Intelligence' ? (
                      <span className="text-gray-900">42 / 200</span>
                    ) : (
                      <span className="text-gray-400" title="Coming soon in our Intelligence Plan">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {userTier === 'Intelligence' ? (
                      <span className="text-gray-900">$425,000</span>
                    ) : (
                      <span className="text-gray-400" title="Coming soon in our Intelligence Plan">—</span>
                    )}
                  </td>
                </tr>
                {expandedRows.has(community.id) && (
                  <tr className="bg-gray-50">
                    <td colSpan={11} className="px-4 py-4">
                      <div className="flex items-center justify-between bg-blue-50 p-3 rounded">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Pricing Factors</h4>
                          <div className="flex flex-wrap gap-2">
                            {community.pricingFactors.map((factor, index) => (
                              <span
                                key={index}
                                className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                                title={`Pricing factor: ${factor}`}
                              >
                                {factor}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <button
                            onClick={() => onUnlock(community.id)}
                            className="bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700 flex items-center space-x-2"
                          >
                            <Unlock size={16} />
                            <span>Unlock for {community.creditsRequired} Credits</span>
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
