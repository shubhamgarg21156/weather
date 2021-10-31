#include<iostream>
#include<conio.h>
using namespace std;
class Number
{
	private:
	int a,b;
	public:
	setData(int a,int b)
	{
		this->a=a;
		this->b=b;
	}
	void showData()
	{
		cout<<"a="<<a<<"  b="<<b<<endl;
	}
	Number operator +(Number n)
	{
		Number temp;
		temp.a=a+n.a;
		temp.b=b+n.b;
		return(temp);
	}
};

main()
{
	Number n1,n2,n3,n4;
	n1.setData(4,5);
	n2.setData(1,2);
	n3.setData(1,1);
	n4=n1+n2+n3;
	n1.showData();
	n2.showData();
	n3.showData();
	n4.showData();
}
