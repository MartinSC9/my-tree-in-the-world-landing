import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shared/components/ui/card';
import { Button } from '@shared/components/ui/button';
import { TreePine, Sprout, CheckCircle, Clock, Filter, MapPin } from 'lucide-react';

const mockStats = [
  {
    title: 'Total Trees',
    value: '3,456',
    change: '+23.1%',
    icon: TreePine,
    gradient: 'from-green-500 to-emerald-500'
  },
  {
    title: 'Planted',
    value: '2,891',
    change: '+18.5%',
    icon: CheckCircle,
    gradient: 'from-emerald-500 to-teal-500'
  },
  {
    title: 'Pending',
    value: '565',
    change: '+12.3%',
    icon: Clock,
    gradient: 'from-orange-500 to-amber-500'
  },
  {
    title: 'Growth Rate',
    value: '94.2%',
    change: '+2.1%',
    icon: Sprout,
    gradient: 'from-red-500 to-orange-500'
  }
];

const mockTrees = [
  {
    id: 'T-001',
    species: 'Oak Tree',
    location: 'Central Park, Zone A',
    status: 'planted',
    plantedDate: '2024-10-15',
    assignedTo: 'Carlos Garcia',
    health: 'Excellent'
  },
  {
    id: 'T-002',
    species: 'Pine Tree',
    location: 'Forest Reserve, Zone B',
    status: 'verified',
    plantedDate: '2024-10-12',
    assignedTo: 'Pedro Sanchez',
    health: 'Good'
  },
  {
    id: 'T-003',
    species: 'Maple Tree',
    location: 'Urban Garden, Zone C',
    status: 'pending',
    plantedDate: '-',
    assignedTo: 'Not assigned',
    health: '-'
  },
  {
    id: 'T-004',
    species: 'Birch Tree',
    location: 'Riverside Park, Zone D',
    status: 'planted',
    plantedDate: '2024-10-18',
    assignedTo: 'Carlos Garcia',
    health: 'Excellent'
  },
  {
    id: 'T-005',
    species: 'Cedar Tree',
    location: 'Mountain Area, Zone E',
    status: 'verified',
    plantedDate: '2024-10-10',
    assignedTo: 'Pedro Sanchez',
    health: 'Good'
  },
  {
    id: 'T-006',
    species: 'Willow Tree',
    location: 'Lake District, Zone F',
    status: 'pending',
    plantedDate: '-',
    assignedTo: 'Luis Ramirez',
    health: '-'
  },
  {
    id: 'T-007',
    species: 'Cherry Tree',
    location: 'Botanical Garden, Zone G',
    status: 'planted',
    plantedDate: '2024-10-20',
    assignedTo: 'Carlos Garcia',
    health: 'Excellent'
  },
  {
    id: 'T-008',
    species: 'Eucalyptus',
    location: 'Coastal Region, Zone H',
    status: 'verified',
    plantedDate: '2024-10-08',
    assignedTo: 'Pedro Sanchez',
    health: 'Good'
  }
];

const getStatusBadgeColor = (status) => {
  switch (status) {
    case 'planted':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'verified':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export default function AdminTreesContent() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-red-800 flex items-center gap-2">
          <TreePine className="h-8 w-8" />
          Tree Management
        </h1>
        <p className="text-gray-600 mt-2">
          Monitor and manage all trees across the platform
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockStats.map((stat, index) => (
          <Card key={index} className="overflow-hidden">
            <div className={`h-2 bg-gradient-to-r ${stat.gradient}`} />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-5 w-5 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
              <p className="text-xs text-green-600 mt-1 font-semibold">
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Trees Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-red-800">All Trees</CardTitle>
              <CardDescription>Complete tree inventory with status tracking</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button className="bg-red-600 hover:bg-red-700 text-white">
                <TreePine className="h-4 w-4 mr-2" />
                Add Tree
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Status Filters */}
          <div className="flex gap-2 mb-6">
            <Button variant="outline" className="bg-red-50 text-red-700 border-red-200">
              All Trees
            </Button>
            <Button variant="outline">
              <CheckCircle className="h-4 w-4 mr-2" />
              Planted
            </Button>
            <Button variant="outline">
              <Sprout className="h-4 w-4 mr-2" />
              Verified
            </Button>
            <Button variant="outline">
              <Clock className="h-4 w-4 mr-2" />
              Pending
            </Button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left p-4 font-semibold text-gray-700">Tree ID</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Species</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Location</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Status</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Planted Date</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Assigned To</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Health</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockTrees.map((tree) => (
                  <tr
                    key={tree.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4">
                      <div className="font-mono font-medium text-gray-900">{tree.id}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-gray-900">{tree.species}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <MapPin className="h-4 w-4" />
                        {tree.location}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeColor(tree.status)}`}>
                        {tree.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="text-gray-600 text-sm">{tree.plantedDate}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-gray-900 text-sm">{tree.assignedTo}</div>
                    </td>
                    <td className="p-4">
                      <div className={`text-sm font-medium ${
                        tree.health === 'Excellent' ? 'text-green-700' :
                        tree.health === 'Good' ? 'text-blue-700' :
                        'text-gray-500'
                      }`}>
                        {tree.health}
                      </div>
                    </td>
                    <td className="p-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                      >
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-gray-600">
              Showing 1 to 8 of 3,456 trees
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" className="bg-red-50 text-red-700 border-red-200">
                1
              </Button>
              <Button variant="outline" size="sm">
                2
              </Button>
              <Button variant="outline" size="sm">
                3
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
