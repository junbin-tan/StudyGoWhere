class SearchDTO {
  final String keyword;
  final String field;
  final int pageNum;
  final int pageSize;
  final String sortField;
  final String sortOrder;

  SearchDTO({
    required this.keyword,
    required this.field,
    required this.pageNum,
    required this.pageSize,
    required this.sortField,
    required this.sortOrder,
  });

  Map<String, dynamic> toJson() {
    return {
      'keyword': keyword,
      'field': field,
      'pageNum': pageNum,
      'pageSize': pageSize,
      'sortField': sortField,
      'sortOrder': sortOrder,
    };
  }
}
